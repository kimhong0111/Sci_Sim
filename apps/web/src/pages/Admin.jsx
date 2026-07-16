import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { simulationService } from "../services/api";
import { availableSketches, sketchRegistry } from "../sketches";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => window.location.href = "/";

  return (
    <div className="admin-login">
      <button className="admin-login__back" onClick={goHome}>
        ← BACK TO HOME
      </button>
      <div className="admin-login__box">
        <h1 className="admin-login__title">ADMIN</h1>
        <p className="admin-login__subtitle">Authentication Required</p>
        <form onSubmit={handleLogin} className="admin-login__form">
          <label className="admin-login__field">
            <span className="admin-login__label">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="admin-login__input" required />
          </label>
          <label className="admin-login__field">
            <span className="admin-login__label">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="admin-login__input" required />
          </label>
          {error && <p className="admin-login__error">{error}</p>}
          <button type="submit" className="admin-login__btn" disabled={loading}>
            {loading ? <span className="admin-login__spinner" /> : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}

const ACTION_LABELS = {
  create_admin: "create a new admin",
  delete_admin: "delete this admin",
  delete_simulation: "delete this simulation",
  create_simulation: "create a new simulation",
  create_subject: "create a new subject",
  create_topic: "create a new topic",
  update_subject: "edit this subject",
  delete_subject: "delete this subject",
  update_topic: "edit this topic",
  delete_topic: "delete this topic",
  update_simulation: "edit this simulation",
};

function ReAuthModal({ action, onVerified, onLogout, onCancel }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await authService.verifyPassword(password, action);
      onVerified(data.action_token);
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        onLogout();
      } else {
        setError(`Incorrect password. ${3 - newAttempts} attempt${3 - newAttempts > 1 ? "s" : ""} remaining.`);
        setPassword("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <h2 className="admin-modal__title">RE-AUTHENTICATE</h2>
        <p className="admin-modal__subtitle">Enter your password to {ACTION_LABELS[action] || action}</p>
        <form onSubmit={handleSubmit} className="admin-modal__form">
          <label className="admin-form__field">
            <span className="admin-form__label">Your Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-form__input"
              required
              autoFocus
            />
          </label>
          {error && <p className="admin-form__error">{error}</p>}
          <div className="admin-form__actions">
            <button type="submit" className="admin-form__btn admin-form__btn--save" disabled={loading}>
              {loading ? <span className="admin-login__spinner" /> : "VERIFY"}
            </button>
            <button type="button" onClick={onCancel} className="admin-form__btn admin-form__btn--cancel">CANCEL</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SimulationForm({ simulation, subjects, topics, onSave, onCancel }) {
  const [title, setTitle] = useState(simulation?.title || "");
  const [description, setDescription] = useState(simulation?.description || "");
  const [subjectId, setSubjectId] = useState(simulation?.subject_id || "");
  const [topicId, setTopicId] = useState(simulation?.topic_id || "");
  const [params, setParams] = useState(
    simulation?.Simulation_Config?.parameter
      ? JSON.stringify(simulation.Simulation_Config.parameter, null, 2)
      : "{}"
  );
  const [sketchKey, setSketchKey] = useState(simulation?.sketch_key || "");
  const [file, setFile] = useState(null);
  const [thumbnailRemoved, setThumbnailRemoved] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sketchKey && simulation && !simulation.Simulation_Config?.parameter) {
      const sketch = sketchRegistry[sketchKey];
      if (sketch?.defaultConfig) {
        setParams(JSON.stringify(sketch.defaultConfig, null, 2));
      }
    }
  }, [sketchKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      let parsed;
      try {
        parsed = JSON.parse(params);
      } catch {
        setError("Invalid JSON in parameters");
        setSaving(false);
        return;
      }
      const payload = {
        title,
        description,
        subject_id: Number(subjectId),
        topic_id: Number(topicId),
        sketch_key: sketchKey || null,
        Simulation_Config: { parameters: parsed },
      };
      if (thumbnailRemoved) payload.remove_thumbnail = true;
      await onSave(payload, file);
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
      <h2 className="admin-form__title">{simulation ? "EDIT SIMULATION" : "NEW SIMULATION"}</h2>

      {simulation?.thumbnail_url && !thumbnailRemoved && (
        <div className="admin-form__preview">
          <img src={simulation.thumbnail_url} alt="Current thumbnail" />
          <button type="button" onClick={() => setThumbnailRemoved(true)} className="admin-form__btn admin-form__btn--danger" style={{ marginTop: '8px' }}>
            REMOVE THUMBNAIL
          </button>
        </div>
      )}

      <label className="admin-form__field">
        <span className="admin-form__label">Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="admin-form__input" required />
      </label>

      <label className="admin-form__field">
        <span className="admin-form__label">Description</span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="admin-form__textarea" rows={3} />
      </label>

      <label className="admin-form__field">
        <span className="admin-form__label">Subject</span>
        <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="admin-form__select" required>
          <option value="">-- Select --</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </label>

      <label className="admin-form__field">
        <span className="admin-form__label">Topic</span>
        <select value={topicId} onChange={(e) => setTopicId(e.target.value)} className="admin-form__select" required>
          <option value="">-- Select --</option>
          {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </label>

      <label className="admin-form__field">
        <span className="admin-form__label">Sketch</span>
        <select value={sketchKey} onChange={(e) => setSketchKey(e.target.value)} className="admin-form__select">
          <option value="">-- No sketch --</option>
          {availableSketches.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </label>

      <label className="admin-form__field">
        <span className="admin-form__label">Parameters (JSON)</span>
        <textarea value={params} onChange={(e) => setParams(e.target.value)} className="admin-form__textarea admin-form__textarea--code" rows={6} />
      </label>

      <label className="admin-form__field">
        <span className="admin-form__label">Thumbnail Image</span>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="admin-form__file" />
      </label>

      {error && <p className="admin-form__error">{error}</p>}

      <div className="admin-form__actions">
        <button type="submit" className="admin-form__btn admin-form__btn--save" disabled={saving}>
          {saving ? "SAVING..." : "SAVE"}
        </button>
        <button type="button" onClick={onCancel} className="admin-form__btn admin-form__btn--cancel">CANCEL</button>
      </div>
    </form>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [user, setUser] = useState(authService.getUser);
  const [simulations, setSimulations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showReAuth, setShowReAuth] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [actionToken, setActionToken] = useState(null);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [adminError, setAdminError] = useState(null);
  const [createAdminLoading, setCreateAdminLoading] = useState(false);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  const isSuperAdmin = user?.id === 1;

  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [subjectError, setSubjectError] = useState(null);
  const [creatingSubject, setCreatingSubject] = useState(false);

  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicSubjectId, setNewTopicSubjectId] = useState("");
  const [topicError, setTopicError] = useState(null);
  const [creatingTopic, setCreatingTopic] = useState(false);

  const [editingSubject, setEditingSubject] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [sims, subs, tops, adms] = await Promise.all([
        simulationService.getAll(),
        simulationService.getSubjects(),
        simulationService.getTopics(),
        authService.getAdmins(),
      ]);
      setSimulations(Array.isArray(sims) ? sims : []);
      setSubjects(Array.isArray(subs) ? subs : []);
      setTopics(Array.isArray(tops) ? tops : []);
      setAdmins(Array.isArray(adms) ? adms : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchAll();
  }, [user, fetchAll]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      authService.refreshToken().catch(() => {});
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (showCreate || editing) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showCreate, editing]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminError(null);
    setCreateAdminLoading(true);
    try {
      await authService.register(newAdminName, newAdminEmail, newAdminPassword, actionToken);
      setNewAdminName("");
      setNewAdminEmail("");
      setNewAdminPassword("");
      setActionToken(null);
      setShowCreateAdmin(false);
      const adms = await authService.getAdmins();
      setAdmins(Array.isArray(adms) ? adms : []);
    } catch (err) {
      if (err.response?.status === 401) {
        setShowCreateAdmin(false);
        setActionToken(null);
        setShowReAuth(true);
        setAdminError("Re-authentication required. Please verify your password again.");
      } else {
        setAdminError(err.response?.data?.message || "Failed to create admin");
      }
    } finally {
      setCreateAdminLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setChangePasswordLoading(true);
    try {
      await authService.changePassword(oldPassword, newPassword);
      setOldPassword("");
      setNewPassword("");
      setShowChangePassword(false);
      alert("Password changed successfully");
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password");
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleDeleteAdmin = (id) => {
    if (!confirm("Delete this admin account?")) return;
    setPendingAction({ action: "delete_admin", payload: id });
    setShowReAuth(true);
  };

  const executeDeleteAdmin = async (actionToken) => {
    try {
      await authService.deleteAdmin(pendingAction.payload, actionToken);
      const adms = await authService.getAdmins();
      setAdmins(Array.isArray(adms) ? adms : []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete admin");
    }
  };

  const handleCreate = async (data, file) => {
    const created = file
      ? await simulationService.createWithImage(data, file, actionToken)
      : await simulationService.create(data, actionToken);
    setSimulations((prev) => [created, ...prev]);
    setShowCreate(false);
    setActionToken(null);
  };

  const [pendingSimSave, setPendingSimSave] = useState(null);

  const handleUpdate = (data, file) => {
    setPendingSimSave({ data, file });
    setPendingAction({ action: "update_simulation", payload: editing });
    setShowReAuth(true);
  };

  const executeUpdateSimulation = async (actionToken) => {
    try {
      const { data, file } = pendingSimSave;
      const id = pendingAction.payload.id;
      const updated = file
        ? await simulationService.updateWithImage(id, data, file, actionToken)
        : await simulationService.update(id, data, actionToken);
      setSimulations((prev) => prev.map((s) => (s.id === id ? updated : s)));
      setEditing(null);
      setPendingSimSave(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setPendingAction({ action: "update_simulation", payload: pendingAction.payload });
        setShowReAuth(true);
      } else {
        alert(err.response?.data?.message || "Failed to update simulation");
      }
    }
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this simulation?")) return;
    setPendingAction({ action: "delete_simulation", payload: id });
    setShowReAuth(true);
  };

  const executeDeleteSimulation = async (actionToken) => {
    try {
      await simulationService.delete(pendingAction.payload, actionToken);
      setSimulations((prev) => prev.filter((s) => s.id !== pendingAction.payload));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete simulation");
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setSubjectError(null);
    setCreatingSubject(true);
    try {
      const created = await simulationService.createSubject(newSubjectName.trim(), actionToken);
      setSubjects((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setNewSubjectName("");
      setActionToken(null);
      setShowCreateSubject(false);
    } catch (err) {
      if (err.response?.status === 401) {
        setShowCreateSubject(false);
        setActionToken(null);
        setPendingAction({ action: "create_subject" });
        setShowReAuth(true);
        setSubjectError("Re-authentication required. Please verify your password again.");
      } else {
        setSubjectError(err.response?.data?.message || "Failed to create subject");
      }
    } finally {
      setCreatingSubject(false);
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    setTopicError(null);
    setCreatingTopic(true);
    try {
      const created = await simulationService.createTopic(newTopicName.trim(), Number(newTopicSubjectId), actionToken);
      setTopics((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      setNewTopicName("");
      setNewTopicSubjectId("");
      setActionToken(null);
      setShowCreateTopic(false);
    } catch (err) {
      if (err.response?.status === 401) {
        setShowCreateTopic(false);
        setActionToken(null);
        setPendingAction({ action: "create_topic" });
        setShowReAuth(true);
        setTopicError("Re-authentication required. Please verify your password again.");
      } else {
        setTopicError(err.response?.data?.message || "Failed to create topic");
      }
    } finally {
      setCreatingTopic(false);
    }
  };

  const handleUpdateSubject = (e) => {
    e.preventDefault();
    setPendingAction({ action: "update_subject", payload: editingSubject });
    setShowReAuth(true);
  };

  const executeUpdateSubject = async (actionToken) => {
    try {
      const updated = await simulationService.updateSubject(pendingAction.payload.id, pendingAction.payload.name.trim(), actionToken);
      setSubjects((prev) => prev.map((s) => (s.id === updated.id ? updated : s)).sort((a, b) => a.name.localeCompare(b.name)));
      setEditingSubject(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setEditingSubject(null);
        setPendingAction({ action: "update_subject", payload: pendingAction.payload });
        setShowReAuth(true);
        setSubjectError("Re-authentication required. Please verify your password again.");
      } else {
        setSubjectError(err.response?.data?.message || "Failed to update subject");
      }
    }
  };

  const handleDeleteSubject = (id) => {
    if (!confirm("Delete this subject? All topics and simulations under it will also be deleted.")) return;
    setPendingAction({ action: "delete_subject", payload: id });
    setShowReAuth(true);
  };

  const executeDeleteSubject = async (actionToken) => {
    try {
      await simulationService.deleteSubject(pendingAction.payload, actionToken);
      setSubjects((prev) => prev.filter((s) => s.id !== pendingAction.payload));
    } catch (err) {
      if (err.response?.status === 401) {
        setPendingAction({ action: "delete_subject", payload: pendingAction.payload });
        setShowReAuth(true);
      } else {
        alert(err.response?.data?.message || "Failed to delete subject");
      }
    }
  };

  const handleUpdateTopic = (e) => {
    e.preventDefault();
    setPendingAction({ action: "update_topic", payload: editingTopic });
    setShowReAuth(true);
  };

  const executeUpdateTopic = async (actionToken) => {
    try {
      const updated = await simulationService.updateTopic(pendingAction.payload.id, pendingAction.payload.name.trim(), Number(pendingAction.payload.subject_id), actionToken);
      setTopics((prev) => prev.map((t) => (t.id === updated.id ? updated : t)).sort((a, b) => a.name.localeCompare(b.name)));
      setEditingTopic(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setEditingTopic(null);
        setPendingAction({ action: "update_topic", payload: pendingAction.payload });
        setShowReAuth(true);
        setTopicError("Re-authentication required. Please verify your password again.");
      } else {
        setTopicError(err.response?.data?.message || "Failed to update topic");
      }
    }
  };

  const handleDeleteTopic = (id) => {
    if (!confirm("Delete this topic? All simulations under it will also be deleted.")) return;
    setPendingAction({ action: "delete_topic", payload: id });
    setShowReAuth(true);
  };

  const executeDeleteTopic = async (actionToken) => {
    try {
      await simulationService.deleteTopic(pendingAction.payload, actionToken);
      setTopics((prev) => prev.filter((t) => t.id !== pendingAction.payload));
    } catch (err) {
      if (err.response?.status === 401) {
        setPendingAction({ action: "delete_topic", payload: pendingAction.payload });
        setShowReAuth(true);
      } else {
        alert(err.response?.data?.message || "Failed to delete topic");
      }
    }
  };

  const handleReAuthVerified = useCallback((token) => {
    setShowReAuth(false);
    const action = pendingAction;
    setPendingAction(null);
    if (!action) return;

    switch (action.action) {
      case "create_admin":
        setActionToken(token);
        setShowCreateAdmin(true);
        break;
      case "create_simulation":
        setActionToken(token);
        setShowCreate(true);
        break;
      case "create_subject":
        setActionToken(token);
        setShowCreateSubject(true);
        break;
      case "create_topic":
        setActionToken(token);
        setShowCreateTopic(true);
        break;
      case "update_subject":
        executeUpdateSubject(token);
        break;
      case "delete_subject":
        executeDeleteSubject(token);
        break;
      case "update_topic":
        executeUpdateTopic(token);
        break;
      case "delete_topic":
        executeDeleteTopic(token);
        break;
      case "update_simulation":
        executeUpdateSimulation(token);
        break;
      case "delete_admin":
        executeDeleteAdmin(token);
        break;
      case "delete_simulation":
        executeDeleteSimulation(token);
        break;
      default:
        break;
    }
  }, [pendingAction]);

  if (!user) return <LoginForm onLogin={(u) => setUser(u)} />;

  return (
    <div className="admin">
      <div className="admin__header">
        <h1 className="admin__title">ADMIN DASHBOARD</h1>
        <div className="admin__header-right">
          <span className="admin__user">{user?.name} {isSuperAdmin && <span className="admin__badge">SUPER-ADMIN</span>}</span>
          <button onClick={() => setShowChangePassword(!showChangePassword)} className="admin__btn admin__btn--secondary">CHANGE PASSWORD</button>
          <button onClick={() => navigate("/")} className="admin__btn admin__btn--secondary">VIEW SITE</button>
          <button onClick={handleLogout} className="admin__btn admin__btn--danger">LOGOUT</button>
        </div>
      </div>

      <div ref={formRef}>
        {showCreate && (
          <SimulationForm
            subjects={subjects}
            topics={topics}
            onSave={handleCreate}
            onCancel={() => setShowCreate(false)}
          />
        )}

        {editing && (
          <SimulationForm
            simulation={editing}
            subjects={subjects}
            topics={topics}
            onSave={(data, file) => handleUpdate(editing.id, data, file)}
            onCancel={() => setEditing(null)}
          />
        )}
      </div>

      {/* Change Password */}
      {showChangePassword && (
        <form onSubmit={handleChangePassword} className="admin-form">
          <h2 className="admin-form__title">CHANGE PASSWORD</h2>
          <label className="admin-form__field">
            <span className="admin-form__label">Current Password</span>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="admin-form__input" required />
          </label>
          <label className="admin-form__field">
            <span className="admin-form__label">New Password</span>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="admin-form__input" required minLength={6} />
          </label>
          {passwordError && <p className="admin-form__error">{passwordError}</p>}
          <div className="admin-form__actions">
            <button type="submit" className="admin-form__btn admin-form__btn--save" disabled={changePasswordLoading}>
              {changePasswordLoading ? <span className="admin-login__spinner" /> : "UPDATE"}
            </button>
            <button type="button" onClick={() => setShowChangePassword(false)} className="admin-form__btn admin-form__btn--cancel">CANCEL</button>
          </div>
        </form>
      )}

      {/* Re-auth modal */}
      {showReAuth && pendingAction && (
        <ReAuthModal
          action={pendingAction.action}
          onVerified={handleReAuthVerified}
          onLogout={() => {
            setShowReAuth(false);
            setPendingAction(null);
            handleLogout();
          }}
          onCancel={() => {
            setShowReAuth(false);
            setPendingAction(null);
          }}
        />
      )}

      {/* Admin Management (super-admin only) */}
      {isSuperAdmin && (
        <>
          <div className="admin__toolbar">
            <h2 className="admin__section-title">ADMINS ({admins.length})</h2>
            <button onClick={() => { setPendingAction({ action: "create_admin", payload: null }); setShowReAuth(true); }} className="admin__btn admin__btn--primary">+ ADD ADMIN</button>
          </div>

          {showCreateAdmin && (
            <form onSubmit={handleCreateAdmin} className="admin-form">
              <h2 className="admin-form__title">NEW ADMIN</h2>
              <label className="admin-form__field">
                <span className="admin-form__label">Name</span>
                <input value={newAdminName} onChange={(e) => setNewAdminName(e.target.value)} className="admin-form__input" required />
              </label>
              <label className="admin-form__field">
                <span className="admin-form__label">Email</span>
                <input type="email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} className="admin-form__input" required />
              </label>
              <label className="admin-form__field">
                <span className="admin-form__label">Password</span>
                <input type="password" value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} className="admin-form__input" required minLength={6} />
              </label>
              {adminError && <p className="admin-form__error">{adminError}</p>}
              <div className="admin-form__actions">
                <button type="submit" className="admin-form__btn admin-form__btn--save" disabled={createAdminLoading}>
                  {createAdminLoading ? <span className="admin-login__spinner" /> : "CREATE"}
                </button>
                <button type="button" onClick={() => setShowCreateAdmin(false)} className="admin-form__btn admin-form__btn--cancel">CANCEL</button>
              </div>
            </form>
          )}

          <div className="admin__table-wrapper" style={{ marginBottom: "1.5rem" }}>
            <table className="admin__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.length === 0 && (
                  <tr><td colSpan={4} className="admin__empty">No admins found</td></tr>
                )}
                {admins.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td className="admin__actions">
                      {a.id !== 1 && (
                        <button onClick={() => handleDeleteAdmin(a.id)} className="admin__btn admin__btn--small admin__btn--danger">DELETE</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ─── SUBJECTS ─── */}
      <div className="admin__toolbar">
        <h2 className="admin__section-title">SUBJECTS ({subjects.length})</h2>
         <button onClick={() => { setPendingAction({ action: "create_subject" }); setShowReAuth(true); }} className="admin__btn admin__btn--primary">+ ADD SUBJECT</button>
      </div>

      {showCreateSubject && (
        <form onSubmit={handleCreateSubject} className="admin-form">
          <h2 className="admin-form__title">NEW SUBJECT</h2>
          <label className="admin-form__field">
            <span className="admin-form__label">Name</span>
            <input value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} className="admin-form__input" required />
          </label>
          {subjectError && <p className="admin-form__error">{subjectError}</p>}
          <div className="admin-form__actions">
            <button type="submit" className="admin-form__btn admin-form__btn--save" disabled={creatingSubject}>
              {creatingSubject ? "CREATING..." : "CREATE"}
            </button>
            <button type="button" onClick={() => setShowCreateSubject(false)} className="admin-form__btn admin-form__btn--cancel">CANCEL</button>
          </div>
        </form>
      )}

      <div className="admin__table-wrapper">
        <table className="admin__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 && (
              <tr><td colSpan={3} className="admin__empty">No subjects found</td></tr>
            )}
            {subjects.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>
                  {editingSubject?.id === s.id ? (
                    <input value={editingSubject.name} onChange={(e) => setEditingSubject({...editingSubject, name: e.target.value})} className="admin-form__input" />
                  ) : (
                    s.name
                  )}
                </td>
                <td className="admin__actions">
                  {editingSubject?.id === s.id ? (
                    <>
                      <button onClick={handleUpdateSubject} className="admin__btn admin__btn--small">SAVE</button>
                      <button onClick={() => setEditingSubject(null)} className="admin__btn admin__btn--small admin__btn--cancel">CANCEL</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditingSubject(s)} className="admin__btn admin__btn--small">EDIT</button>
                      <button onClick={() => handleDeleteSubject(s.id)} className="admin__btn admin__btn--small admin__btn--danger">DELETE</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── TOPICS ─── */}
      <div className="admin__toolbar">
        <h2 className="admin__section-title">TOPICS ({topics.length})</h2>
         <button onClick={() => { setPendingAction({ action: "create_topic" }); setShowReAuth(true); }} className="admin__btn admin__btn--primary">+ ADD TOPIC</button>
      </div>

      {showCreateTopic && (
        <form onSubmit={handleCreateTopic} className="admin-form">
          <h2 className="admin-form__title">NEW TOPIC</h2>
          <label className="admin-form__field">
            <span className="admin-form__label">Name</span>
            <input value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} className="admin-form__input" required />
          </label>
          <label className="admin-form__field">
            <span className="admin-form__label">Subject</span>
            <select value={newTopicSubjectId} onChange={(e) => setNewTopicSubjectId(e.target.value)} className="admin-form__select" required>
              <option value="">-- Select --</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          {topicError && <p className="admin-form__error">{topicError}</p>}
          <div className="admin-form__actions">
            <button type="submit" className="admin-form__btn admin-form__btn--save" disabled={creatingTopic}>
              {creatingTopic ? "CREATING..." : "CREATE"}
            </button>
            <button type="button" onClick={() => setShowCreateTopic(false)} className="admin-form__btn admin-form__btn--cancel">CANCEL</button>
          </div>
        </form>
      )}

      <div className="admin__table-wrapper">
        <table className="admin__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {topics.length === 0 && (
              <tr><td colSpan={4} className="admin__empty">No topics found</td></tr>
            )}
            {topics.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>
                  {editingTopic?.id === t.id ? (
                    <input value={editingTopic.name} onChange={(e) => setEditingTopic({...editingTopic, name: e.target.value})} className="admin-form__input" />
                  ) : (
                    t.name
                  )}
                </td>
                <td>
                  {editingTopic?.id === t.id ? (
                    <select value={editingTopic.subject_id} onChange={(e) => setEditingTopic({...editingTopic, subject_id: Number(e.target.value)})} className="admin-form__select">
                      <option value="">-- Select --</option>
                      {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  ) : (
                    subjects.find((s) => s.id === t.subject_id)?.name || t.subject_id
                  )}
                </td>
                <td className="admin__actions">
                  {editingTopic?.id === t.id ? (
                    <>
                      <button onClick={handleUpdateTopic} className="admin__btn admin__btn--small">SAVE</button>
                      <button onClick={() => setEditingTopic(null)} className="admin__btn admin__btn--small admin__btn--cancel">CANCEL</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditingTopic(t)} className="admin__btn admin__btn--small">EDIT</button>
                      <button onClick={() => handleDeleteTopic(t.id)} className="admin__btn admin__btn--small admin__btn--danger">DELETE</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin__toolbar">
        <h2 className="admin__section-title">SIMULATIONS ({simulations.length})</h2>
        <button onClick={() => { setPendingAction({ action: "create_simulation" }); setShowReAuth(true); }} className="admin__btn admin__btn--primary">+ CREATE</button>
      </div>

      {loading ? (
        <p className="admin__loading">Loading...</p>
      ) : (
        <div className="admin__table-wrapper">
          <table className="admin__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Subject</th>
                <th>Topic</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {simulations.length === 0 && (
                <tr><td colSpan={5} className="admin__empty">No simulations found</td></tr>
              )}
              {simulations.map((sim) => (
                <tr key={sim.id}>
                  <td>{sim.id}</td>
                  <td>{sim.title}</td>
                  <td>{sim.Subject?.name || "-"}</td>
                  <td>{sim.Topic?.name || "-"}</td>
                  <td className="admin__actions">
                    <button onClick={() => setEditing(sim)} className="admin__btn admin__btn--small">EDIT</button>
                    <button onClick={() => handleDelete(sim.id)} className="admin__btn admin__btn--small admin__btn--danger">DELETE</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
