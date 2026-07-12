import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { simulationService } from "../services/api";
import { availableSketches } from "../sketches";

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
      if (data.user.role !== "admin") {
        setError("Admin access only");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
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

function SimulationForm({ simulation, subjects, topics, onSave, onCancel }) {
  const [title, setTitle] = useState(simulation?.title || "");
  const [description, setDescription] = useState(simulation?.description || "");
  const [subjectId, setSubjectId] = useState(simulation?.subject_id || "");
  const [topicId, setTopicId] = useState(simulation?.topic_id || "");
  const [params, setParams] = useState(
    simulation?.Simulation_Config?.parameters
      ? JSON.stringify(simulation.Simulation_Config.parameters, null, 2)
      : "{}"
  );
  const [sketchKey, setSketchKey] = useState(simulation?.sketch_key || "");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

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
      await onSave({
        title,
        description,
        subject_id: Number(subjectId),
        topic_id: Number(topicId),
        sketch_key: sketchKey || null,
        Simulation_Config: { parameters: parsed },
      }, file);
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
      <h2 className="admin-form__title">{simulation ? "EDIT SIMULATION" : "NEW SIMULATION"}</h2>

      {simulation?.thumbnail_url && (
        <div className="admin-form__preview">
          <img src={simulation.thumbnail_url} alt="Current thumbnail" />
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
  const [user, setUser] = useState(authService.getUser);
  const [simulations, setSimulations] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [adminError, setAdminError] = useState(null);
  const [createAdminLoading, setCreateAdminLoading] = useState(false);
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

  if (!user) return <LoginForm onLogin={(u) => setUser(u)} />;

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminError(null);
    setCreateAdminLoading(true);
    try {
      await authService.register(newAdminName, newAdminEmail, newAdminPassword);
      setNewAdminName("");
      setNewAdminEmail("");
      setNewAdminPassword("");
      setShowCreateAdmin(false);
      const adms = await authService.getAdmins();
      setAdmins(Array.isArray(adms) ? adms : []);
    } catch (err) {
      setAdminError(err.response?.data?.message || "Failed to create admin");
    } finally {
      setCreateAdminLoading(false);
    }
  };

  const handleCreate = async (data, file) => {
    const created = file
      ? await simulationService.createWithImage(data, file)
      : await simulationService.create(data);
    setSimulations((prev) => [created, ...prev]);
    setShowCreate(false);
  };

  const handleUpdate = async (id, data, file) => {
    const updated = file
      ? await simulationService.updateWithImage(id, data, file)
      : await simulationService.update(id, data);
    setSimulations((prev) => prev.map((s) => (s.id === id ? updated : s)));
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this simulation?")) return;
    await simulationService.delete(id);
    setSimulations((prev) => prev.filter((s) => s.id !== id));
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <div className="admin">
      <div className="admin__header">
        <h1 className="admin__title">ADMIN DASHBOARD</h1>
        <div className="admin__header-right">
          <span className="admin__user">{user?.name} ({user?.role})</span>
          <button onClick={() => navigate("/")} className="admin__btn admin__btn--secondary">VIEW SITE</button>
          <button onClick={handleLogout} className="admin__btn admin__btn--danger">LOGOUT</button>
        </div>
      </div>

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

      {/* Admin Management */}
      <div className="admin__toolbar">
        <h2 className="admin__section-title">ADMINS ({admins.length})</h2>
        <button onClick={() => setShowCreateAdmin(!showCreateAdmin)} className="admin__btn admin__btn--primary">+ ADD ADMIN</button>
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
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 && (
              <tr><td colSpan={3} className="admin__empty">No admins found</td></tr>
            )}
            {admins.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td>{a.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin__toolbar">
        <h2 className="admin__section-title">SIMULATIONS ({simulations.length})</h2>
        <button onClick={() => setShowCreate(true)} className="admin__btn admin__btn--primary">+ CREATE</button>
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
