// pages/ChatPage.jsx — Chat with one or many matched peers (separate channel each)

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom, streamTokenAtom } from "../store/atoms";
import api from "../utils/api";
import { getPeerFromMatch } from "../utils/peer";
import Spinner from "../components/ui/Spinner";

import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

const ChatPage = () => {
  const { matchId: routeMatchId } = useParams();
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);
  const streamToken = useRecoilValue(streamTokenAtom);
  const setStreamToken = useSetRecoilState(streamTokenAtom);

  const [matches, setMatches] = useState([]);
  const [activeMatchId, setActiveMatchId] = useState(routeMatchId || null);
  const [match, setMatch] = useState(null);
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState(null);

  const clientRef = useRef(null);
  const channelRef = useRef(null);
  const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

  // Sync route param
  useEffect(() => {
    if (routeMatchId) setActiveMatchId(routeMatchId);
  }, [routeMatchId]);

  // Load all matches for sidebar
  useEffect(() => {
    if (!user) {
      setListLoading(false);
      return;
    }

    const fetchMatches = async () => {
      setListLoading(true);
      try {
        const { data } = await api.get("/peers/my-matches");
        const list = data.matches || [];
        setMatches(list);

        if (list.length === 0) return;

        const routeValid = routeMatchId && list.some((m) => m._id === routeMatchId);
        if (routeValid) {
          setActiveMatchId(routeMatchId);
        } else {
          const pick = list[0]._id;
          setActiveMatchId(pick);
          if (routeMatchId !== pick) {
            navigate(`/chat/${pick}`, { replace: true });
          }
        }
      } catch {
        setMatches([]);
      } finally {
        setListLoading(false);
      }
    };

    fetchMatches();
  }, [user, routeMatchId, navigate]);

  // Connect Stream + open channel for activeMatchId
  useEffect(() => {
    if (!user || !STREAM_API_KEY || !activeMatchId) return;

    let cancelled = false;

    const openChat = async () => {
      setChatLoading(true);
      setError(null);
      setClient(null);
      setChannel(null);

      try {
        const { data } = await api.get(`/peers/matches/${activeMatchId}`);
        if (cancelled) return;

        const activeMatch = data.match;
        setMatch(activeMatch);

        const channelId = activeMatch?.streamChannelId;
        if (!channelId) {
          setError("Chat channel not ready. Open Peer Match and refresh.");
          return;
        }

        let token = streamToken;
        try {
          const { data: tokenData } = await api.get("/auth/stream-token");
          token = tokenData.streamToken;
          if (token) {
            setStreamToken(token);
            localStorage.setItem("skillforge_stream_token", token);
          }
        } catch {
          /* use cached */
        }

        if (!token) {
          setError("Missing chat token. Log out and log in again.");
          return;
        }

        const userId = String(user._id);
        const chatClient = StreamChat.getInstance(STREAM_API_KEY);

        if (chatClient.userID && chatClient.userID !== userId) {
          await chatClient.disconnectUser();
        }

        if (!chatClient.userID) {
          await chatClient.connectUser(
            {
              id: userId,
              name: user.name,
              image:
                user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f97316&color=fff`,
            },
            token
          );
        }

        if (cancelled) {
          await chatClient.disconnectUser();
          return;
        }

        clientRef.current = chatClient;

        if (channelRef.current) {
          await channelRef.current.stopWatching().catch(() => {});
        }

        const matchedChannel = chatClient.channel("messaging", channelId, {
          members: activeMatch.students?.map((s) => String(s._id ?? s)) || [],
        });

        try {
          await matchedChannel.watch();
        } catch (watchErr) {
          // Permission race — retry once after Stream syncs membership
          if (watchErr.code === 17 || watchErr.message?.includes("ReadChannel")) {
            await new Promise((r) => setTimeout(r, 800));
            await matchedChannel.watch();
          } else {
            throw watchErr;
          }
        }
        channelRef.current = matchedChannel;

        if (cancelled) return;

        setClient(chatClient);
        setChannel(matchedChannel);
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 404) {
          setError("This match was not found.");
        } else {
          setError(err.message || "Failed to connect to chat.");
        }
      } finally {
        if (!cancelled) setChatLoading(false);
      }
    };

    openChat();

    return () => {
      cancelled = true;
    };
  }, [user, STREAM_API_KEY, activeMatchId, setStreamToken]);

  useEffect(() => {
    return () => {
      channelRef.current?.stopWatching().catch(() => {});
      channelRef.current = null;
      clientRef.current?.disconnectUser().catch(() => {});
      clientRef.current = null;
    };
  }, []);

  const selectMatch = (id) => {
    if (id === activeMatchId) return;
    setActiveMatchId(id);
    navigate(`/chat/${id}`);
  };

  if (!STREAM_API_KEY) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card border-amber-500/30 bg-amber-500/5">
          <h2 className="text-xl font-display font-bold text-white mb-3">
            Stream API Key Not Set
          </h2>
          <p className="text-dark-300 text-sm">Add VITE_STREAM_API_KEY to frontend .env</p>
        </div>
      </div>
    );
  }

  if (listLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="card">
          <div className="text-4xl mb-4">💬</div>
          <h2 className="text-xl font-display font-bold text-white mb-2">No peer chats yet</h2>
          <p className="text-dark-400 text-sm mb-6">
            Find peers on the match page — each match opens a separate private chat.
          </p>
          <Link to="/peer-match" className="btn-primary">
            Go to Peer Match →
          </Link>
        </div>
      </div>
    );
  }

  const peer = getPeerFromMatch(match, user?._id);
  const myId = String(user?._id ?? "");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="section-label mb-1">Peer Study Rooms</p>
          <h1 className="text-2xl font-display font-bold text-white">
            {peer?.name ? (
              <>
                Chat with <span className="gradient-text">{peer.name}</span>
              </>
            ) : (
              "Peer Chat"
            )}
          </h1>
        </div>
        <Link to="/peer-match" className="btn-secondary text-sm py-2">
          + Find More Peers
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 card p-3 max-h-[640px] overflow-y-auto">
          <p className="section-label mb-3 px-1">Conversations ({matches.length})</p>
          <div className="space-y-2">
            {matches.map((m) => {
              const p = getPeerFromMatch(m, myId);
              const isActive = m._id === activeMatchId;
              return (
                <button
                  key={m._id}
                  type="button"
                  onClick={() => selectMatch(m._id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isActive
                      ? "border-forge-500/50 bg-forge-500/10"
                      : "border-dark-700 bg-dark-900 hover:border-dark-600"
                  }`}
                >
                  <p className="font-display font-medium text-white text-sm truncate">
                    {p?.name || "Study partner"}
                  </p>
                  <p className="text-dark-500 text-xs font-mono mt-0.5 truncate">
                    {m.matchReason || "Peer match"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-2">
          {chatLoading && (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 card">
              <Spinner size="lg" />
              <p className="text-dark-400 font-mono text-sm">Connecting...</p>
            </div>
          )}

          {error && !chatLoading && (
            <div className="card text-center py-12">
              <p className="text-red-400 text-sm font-mono mb-4">{error}</p>
              <Link to="/peer-match" className="btn-primary text-sm py-2 inline-block">
                Peer Match →
              </Link>
            </div>
          )}

          {!chatLoading && !error && client && channel && (
            <div
              className="rounded-2xl overflow-hidden border border-dark-700"
              style={{ height: "600px" }}
            >
              <Chat client={client} theme="str-chat__theme-dark">
                <Channel channel={channel}>
                  <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput focus />
                  </Window>
                  <Thread />
                </Channel>
              </Chat>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
