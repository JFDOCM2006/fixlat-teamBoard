import { useEffect, useState } from "react";
import {
  UserPlus,
  Pencil,
  Trash2,
  X,
  Save,
  Users as UsersIcon,
} from "lucide-react";

import DashboardLayout from "../Layouts/DashboardLayout";
import { api } from "../services/api";

function Usuarios() {
  // ================================
  // Estados
  // ================================

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    active: true,
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // ================================
  // Obtener usuario actual
  // ================================

  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error obteniendo usuario actual:", error);
      return null;
    }
  };

  // ================================
  // Obtener usuarios
  // ================================

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api("/users");

      setUsers(data.users || []);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // Verificar permisos
  // ================================

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      setIsAdmin(false);
      setLoading(false);
      setError("No se encontró la sesión del usuario.");
      return;
    }

    if (currentUser.role !== "ADMIN") {
      setIsAdmin(false);
      setLoading(false);
      setError("No tienes permisos para acceder a la gestión de usuarios.");
      return;
    }

    setIsAdmin(true);
    loadUsers();
  }, []);

  // ================================
  // Crear usuario
  // ================================

  const handleCreate = () => {
    setEditingUser(null);

    setForm({
      name: "",
      email: "",
      password: "",
      role: "USER",
      active: true,
    });

    setError("");
    setModalOpen(true);
  };

  // ================================
  // Editar usuario
  // ================================

  const handleEdit = (user) => {
    setEditingUser(user);

    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      active: user.active,
    });

    setError("");
    setModalOpen(true);
  };

  // ================================
  // Cerrar modal
  // ================================

  const handleClose = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setEditingUser(null);
    setError("");
  };

  // ================================
  // Cambiar campos del formulario
  // ================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================================
  // Cambiar estado del usuario
  // ================================

  const handleToggleActive = () => {
    setForm((prev) => ({
      ...prev,
      active: !prev.active,
    }));
  };

  // ================================
  // Guardar usuario
  // ================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      // Editar usuario existente
      if (editingUser) {
        const updates = {
          name: form.name,
          email: form.email,
          role: form.role,
          active: form.active,
        };

        // La contraseña solamente se modifica
        // si el administrador escribe una nueva
        if (form.password.trim()) {
          updates.password = form.password;
        }

        await api(`/users/${editingUser.id}`, {
          method: "PUT",
          body: JSON.stringify(updates),
        });
      }

      // Crear usuario nuevo
      else {
        await api("/users", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
          }),
        });
      }

      await loadUsers();

      setModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error guardando usuario:", error);

      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // Eliminar usuario
  // ================================

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar a ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api(`/users/${user.id}`, {
        method: "DELETE",
      });

      setUsers((prev) =>
        prev.filter((item) => item.id !== user.id)
      );
    } catch (error) {
      console.error("Error eliminando usuario:", error);

      alert(error.message);
    }
  };

  // ================================
  // Render
  // ================================

  return (
    <DashboardLayout>
      {/* Sin permisos */}
      {!isAdmin ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="rounded-xl border border-red-100 bg-red-50 px-6 py-5 text-center">
            <h2 className="text-lg font-semibold text-red-700">
              Acceso restringido
            </h2>

            <p className="mt-1 text-sm text-red-600">
              {error || "No tienes permisos para acceder a esta sección."}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Encabezado */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-800">
                <UsersIcon className="h-6 w-6 text-[#297AFF]" />

                Usuarios
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Administra los usuarios de TeamBoard
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreate}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <UserPlus size={18} />

              Nuevo usuario
            </button>
          </div>

          {/* Tabla de usuarios */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Usuario
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Correo
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Rol
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Estado
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* Cargando */}
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      Cargando usuarios...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  /* Sin usuarios */
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-10 text-center text-sm text-slate-500"
                    >
                      No hay usuarios registrados.
                    </td>
                  </tr>
                ) : (
                  /* Lista de usuarios */
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* Nombre */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">
                          {user.name}
                        </p>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {user.email}
                      </td>

                      {/* Rol */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            user.role === "ADMIN"
                              ? "bg-purple-50 text-purple-600"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {user.role === "ADMIN"
                            ? "Administrador"
                            : "Usuario"}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${
                            user.active
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              user.active
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />

                          {user.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {/* Editar */}
                          <button
                            type="button"
                            onClick={() => handleEdit(user)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            title="Editar usuario"
                          >
                            <Pencil size={17} />
                          </button>

                          {/* Eliminar */}
                          <button
                            type="button"
                            onClick={() => handleDelete(user)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                            title="Eliminar usuario"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
              <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
                {/* Header modal */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {editingUser
                        ? "Editar usuario"
                        : "Nuevo usuario"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      {editingUser
                        ? "Actualiza los datos del usuario"
                        : "Crea una nueva cuenta"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Formulario */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 p-6"
                >
                  {/* Nombre */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Nombre
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Correo electrónico
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      required
                    />
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Contraseña
                    </label>

                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder={
                        editingUser
                          ? "Dejar vacío para mantenerla"
                          : "Contraseña"
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      required={!editingUser}
                    />
                  </div>

                  {/* Rol */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Rol
                    </label>

                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    >
                      <option value="USER">
                        Usuario
                      </option>

                      <option value="ADMIN">
                        Administrador
                      </option>
                    </select>
                  </div>

                  {/* Estado */}
                  {editingUser && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Estado
                      </label>

                      <button
                        type="button"
                        onClick={handleToggleActive}
                        className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-3 transition hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              form.active
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />

                          <div className="text-left">
                            <p className="text-sm font-medium text-slate-700">
                              {form.active
                                ? "Activo"
                                : "Inactivo"}
                            </p>

                            <p className="text-xs text-slate-400">
                              {form.active
                                ? "El usuario puede acceder al sistema"
                                : "El usuario no puede acceder al sistema"}
                            </p>
                          </div>
                        </div>

                        {/* Switch */}
                        <span
                          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                            form.active
                              ? "bg-emerald-500"
                              : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                              form.active
                                ? "translate-x-5"
                                : "translate-x-0.5"
                            }`}
                          />
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  {/* Botones */}
                  <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={saving}
                      className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save size={17} />

                      {saving
                        ? "Guardando..."
                        : editingUser
                          ? "Guardar cambios"
                          : "Crear usuario"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default Usuarios;