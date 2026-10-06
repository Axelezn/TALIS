import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { 
  Send, 
  User, 
  Building2, 
  MessageSquare, 
  Search, 
  Circle, 
  CheckCheck, 
  Paperclip, 
  ChevronLeft,
  Briefcase,
  Plus,
  Lock,
  X,
  GraduationCap
} from 'lucide-react';
import './ChatView.scss';

export default function ChatView() {
  // Check local authentication
  const [authData, setAuthData] = useState(() => {
    const token = localStorage.getItem('talis_token');
    const rawUser = localStorage.getItem('talis_user');
    let user = null;
    if (rawUser) {
      try { user = JSON.parse(rawUser); } catch { user = null; }
    }
    return { token, user };
  });

  const currentUser = authData.user;
  const isAuthenticated = Boolean(authData.token && currentUser);

  const [conversations, setConversations] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [typingUser, setTypingUser] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);

  // New Chat Modal for Recruiters
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load user-specific conversations
  const loadConversations = () => {
    if (!currentUser) return;
    fetch(`/api/chat/conversations?userId=${currentUser.id}&role=${currentUser.role}`)
      .then(res => res.json())
      .then(data => {
        if (data.conversations) {
          setConversations(data.conversations);
          if (data.conversations.length > 0 && !activeRoomId) {
            setActiveRoomId(data.conversations[0].id);
          }
        }
      })
      .catch(err => console.error('Erreur chargement conversations:', err));
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated, currentUser?.id, currentUser?.role]);

  // Socket.IO Setup
  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;

    const socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('register_user', {
        userId: currentUser.id,
        name: `${currentUser.prenom || ''} ${currentUser.nom || ''}`.trim() || 'Utilisateur',
        role: currentUser.role,
      });

      if (activeRoomId) {
        socket.emit('join_room', activeRoomId);
      }
    });

    socket.on('room_history', (data) => {
      if (data.roomId === activeRoomId) {
        setMessages(data.messages || []);
      }
    });

    socket.on('new_message', (msg) => {
      if (msg.roomId === activeRoomId) {
        setMessages(prev => [...prev, msg]);
      }
      loadConversations();
    });

    socket.on('conversations_updated', () => {
      loadConversations();
    });

    socket.on('user_typing', (data) => {
      if (data.roomId === activeRoomId) {
        setTypingUser(data.isTyping ? data.userName : '');
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, currentUser?.id, activeRoomId]);

  // Active room change
  useEffect(() => {
    if (!activeRoomId) return;

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('join_room', activeRoomId);
    }

    fetch(`/api/chat/messages/${activeRoomId}`)
      .then(res => res.json())
      .then(data => {
        if (data.messages) {
          setMessages(data.messages);
        }
      })
      .catch(err => console.error(err));

    setTypingUser('');
  }, [activeRoomId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  // Handle open new chat modal for recruiters
  const handleOpenNewChatModal = () => {
    setIsNewChatModalOpen(true);
    fetch('/api/chat/students')
      .then(res => res.json())
      .then(data => {
        if (data.students) {
          setStudentsList(data.students);
        }
      })
      .catch(err => console.error('Erreur chargement étudiants:', err));
  };

  // Create or open chat with selected student
  const handleSelectStudentForChat = async (student) => {
    if (isCreatingChat) return;
    setIsCreatingChat(true);

    try {
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          recruiterId: currentUser.id,
        }),
      });
      const data = await res.json();
      if (data.success && data.conversationId) {
        setActiveRoomId(data.conversationId);
        loadConversations();
        setIsNewChatModalOpen(false);
        setIsMobileListOpen(false);
      }
    } catch (err) {
      console.error('Erreur lors de la création de la discussion:', err);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socketRef.current || !activeRoomId) return;

    const senderName = `${currentUser.prenom || ''} ${currentUser.nom || ''}`.trim() || 'Utilisateur';

    socketRef.current.emit('send_message', {
      roomId: activeRoomId,
      senderId: currentUser.id,
      senderName,
      senderRole: currentUser.role,
      text: inputText.trim(),
    });

    socketRef.current.emit('typing_stop', { roomId: activeRoomId });
    setInputText('');
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (socketRef.current && activeRoomId) {
      const senderName = currentUser.prenom || 'Utilisateur';
      socketRef.current.emit('typing_start', { roomId: activeRoomId, userName: senderName });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit('typing_stop', { roomId: activeRoomId });
      }, 1500);
    }
  };

  // If user is not logged in
  if (!isAuthenticated) {
    return (
      <div className="chat-page-container">
        <div className="unauthenticated-box">
          <div className="lock-icon-wrapper">
            <Lock size={32} />
          </div>
          <h2>Accès réservé aux utilisateurs connectés</h2>
          <p>
            Vous devez être connecté à votre compte TALIS (étudiant ou recruteur) pour accéder à votre messagerie instantanée.
          </p>
          <Link to="/login" className="login-btn">
            <span>Se connecter à mon compte</span>
          </Link>
        </div>
      </div>
    );
  }

  const currentConversation = conversations.find(c => c.id === activeRoomId) || conversations[0];

  const filteredConversations = conversations.filter(c => {
    const term = searchQuery.toLowerCase();
    return c.studentName.toLowerCase().includes(term) || 
           c.companyName.toLowerCase().includes(term) ||
           c.studentMajor.toLowerCase().includes(term) ||
           c.recruiterName.toLowerCase().includes(term);
  });

  const filteredStudents = studentsList.filter(s => {
    const term = studentSearchQuery.toLowerCase().trim();
    if (!term) return true;
    const fullName = `${s.prenom || ''} ${s.nom || ''}`.toLowerCase();
    const formation = (s.formation || s.study_level || '').toLowerCase();
    const city = (s.city || '').toLowerCase();
    const mail = (s.mail || '').toLowerCase();
    return fullName.includes(term) || formation.includes(term) || city.includes(term) || mail.includes(term);
  });

  return (
    <div className="chat-page-container">
      <div className="chat-layout">
        {/* Sidebar Conversations */}
        <aside className={`chat-sidebar ${isMobileListOpen ? 'mobile-open' : 'mobile-closed'}`}>
          <div className="sidebar-header">
            <div className="sidebar-title-row">
              <h2>
                <MessageSquare size={22} className="header-icon" /> Discussions
              </h2>
              {currentUser.role === 'entreprise' && (
                <button 
                  type="button" 
                  className="btn-new-chat"
                  onClick={handleOpenNewChatModal}
                  title="Démarrer une discussion avec un étudiant"
                >
                  <Plus size={16} /> Nouveau
                </button>
              )}
            </div>

            <div className="search-box">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Rechercher une discussion..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="conversations-list">
            {filteredConversations.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                {currentUser.role === 'entreprise' 
                  ? "Aucune conversation. Cliquez sur '+ Nouveau' pour contacter un étudiant."
                  : "Aucune conversation en cours pour le moment."
                }
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = conv.id === activeRoomId;
                const otherPartyName = currentUser.role === 'entreprise' ? conv.studentName : conv.companyName;
                const otherPartyRole = currentUser.role === 'entreprise' ? conv.studentMajor : `Recruteur: ${conv.recruiterName}`;

                return (
                  <div 
                    key={conv.id} 
                    className={`conversation-card ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveRoomId(conv.id);
                      setIsMobileListOpen(false);
                    }}
                  >
                    <div className="avatar-box">
                      {currentUser.role === 'entreprise' ? (
                        <div className="avatar-circle avatar-student">
                          <User size={20} />
                        </div>
                      ) : (
                        <div className="avatar-circle avatar-company">
                          <Building2 size={20} />
                        </div>
                      )}
                      <span className="online-indicator"></span>
                    </div>

                    <div className="card-details">
                      <div className="card-top-line">
                        <span className="party-name">{otherPartyName}</span>
                        <span className="time-badge">En ligne</span>
                      </div>
                      <span className="party-subtitle">{otherPartyRole}</span>
                      <p className="last-message">{conv.lastMessage || 'Aucun message'}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Main Conversation Room */}
        <main className={`chat-main ${!isMobileListOpen ? 'mobile-open' : 'mobile-closed'}`}>
          {currentConversation ? (
            <>
              {/* Header Room */}
              <div className="room-header">
                <button 
                  type="button" 
                  className="mobile-back-btn"
                  onClick={() => setIsMobileListOpen(true)}
                >
                  <ChevronLeft size={20} /> Discussions
                </button>

                <div className="room-party-info">
                  <div className="party-avatar">
                    {currentUser.role === 'entreprise' ? (
                      <User size={24} />
                    ) : (
                      <Building2 size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="party-title">
                      {currentUser.role === 'entreprise' ? currentConversation.studentName : currentConversation.companyName}
                    </h3>
                    <p className="party-meta">
                      {currentUser.role === 'entreprise' 
                        ? `${currentConversation.studentMajor}`
                        : `Contact: ${currentConversation.recruiterName}`
                      }
                    </p>
                  </div>
                </div>

                <div className="status-badge">
                  <Circle size={10} className="status-dot-active" /> Connecté
                </div>
              </div>

              {/* Message Feed */}
              <div className="messages-feed">
                <div className="system-notice">
                  <Briefcase size={16} /> Échange direct entre {currentUser.prenom} ({currentUser.role === 'entreprise' ? 'Recruteur' : 'Étudiant'}) et votre interlocuteur
                </div>

                {messages.map((msg) => {
                  const isMe = msg.senderId === String(currentUser.id) || msg.senderRole === currentUser.role;

                  return (
                    <div 
                      key={msg.id} 
                      className={`message-bubble-wrapper ${isMe ? 'msg-outgoing' : 'msg-incoming'}`}
                    >
                      <div className="message-bubble">
                        <div className="msg-sender-name">{msg.senderName}</div>
                        <div className="msg-text">{msg.text}</div>
                        <div className="msg-footer">
                          <span className="msg-time">{msg.timestamp}</span>
                          {isMe && <CheckCheck size={14} className="check-icon" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {typingUser && (
                  <div className="typing-indicator">
                    <span className="typing-text">{typingUser} est en train d'écrire...</span>
                    <span className="dots">
                      <span>.</span><span>.</span><span>.</span>
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form className="chat-input-bar" onSubmit={handleSendMessage}>
                <button type="button" className="btn-attachment" title="Joindre un fichier">
                  <Paperclip size={20} />
                </button>

                <input 
                  type="text" 
                  className="chat-text-input" 
                  placeholder="Écrivez votre message..."
                  value={inputText}
                  onChange={handleInputChange}
                />

                <button 
                  type="submit" 
                  className="btn-send"
                  disabled={!inputText.trim()}
                >
                  <span>Envoyer</span>
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="no-conversation">
              <MessageSquare size={48} />
              <h3>Sélectionnez ou démarrez une discussion</h3>
              <p>Vos échanges instantanés avec les étudiants et recruteurs apparaissent ici.</p>
            </div>
          )}
        </main>
      </div>

      {/* Recruiter New Chat Modal */}
      {isNewChatModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewChatModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Contacter un étudiant</h3>
              <button className="close-btn" onClick={() => setIsNewChatModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-search">
              <input 
                type="text"
                className="modal-search-input"
                placeholder="Rechercher par nom, formation ou ville..."
                value={studentSearchQuery}
                onChange={e => setStudentSearchQuery(e.target.value)}
              />
            </div>

            <div className="students-list">
              {filteredStudents.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                  Aucun étudiant trouvé.
                </div>
              ) : (
                filteredStudents.map((st) => (
                  <div 
                    key={st.id} 
                    className="student-item"
                    onClick={() => handleSelectStudentForChat(st)}
                  >
                    <div className="student-avatar">
                      {(st.prenom ? st.prenom.charAt(0) : 'E')}
                    </div>
                    <div className="student-info">
                      <div className="student-name">
                        {st.prenom} {st.nom}
                      </div>
                      <div className="student-sub">
                        {st.formation || st.study_level || 'Étudiant TALIS'} {st.city ? `• ${st.city}` : ''}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
