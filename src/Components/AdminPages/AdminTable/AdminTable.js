import React, { useEffect, useState } from 'react';
import { Table, Button, Input } from 'reactstrap';
import { getAllAdmins, deleteAdmin, updateAdmin, createAdmin } from '../../API/admin-account';
import '../UserTable/UserTable.css';
import '../AdminTable/AdminTable.css';
import ClickableLogo from "../../ClickableLogo";

const AdminTablePage = () => {
    const [admins, setAdmins] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [adminData, setAdminData] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '' });

    useEffect(() => {
        loadAdmins();
    }, []);

    const loadAdmins = () => {
        getAllAdmins((result, status, error) => {
            if (status === 200 && result) setAdmins(result);
            else console.error("Eroare la preluarea adminilor:", error);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (admin) => {
        setEditableId(admin.id);
        setAdminData(admin);
    };

    const handleSave = () => {
        updateAdmin(adminData, (result, status, error) => {
            if (status === 200) {
                setEditableId(null);
                loadAdmins();
            } else {
                console.error("Eroare la update:", error);
            }
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this admin?")) {
            deleteAdmin(id, (result, status, error) => {
                if (status === 200) loadAdmins();
                else console.error("Eroare la delete:", error);
            });
        }
    };

    const handleCreateAdmin = () => {
        createAdmin(newAdmin, (result, status, error) => {
            if (status === 200) {
                setShowForm(false);
                setNewAdmin({ username: '', email: '', password: '' });
                loadAdmins();
            } else {
                console.error("Eroare la crearea adminului:", error);
            }
        });
    };

    const filtered = admins.filter(a =>
        a.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="user-table-container">
            <ClickableLogo className="admin-logo"/>

            <div className="search-wrapper with-button">
                <i className="fas fa-search search-icon" />
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
                <Button className="add-button" color="primary" onClick={() => setShowForm(true)}>
                    <i className="fas fa-plus"></i>
                </Button>
            </div>

            {showForm && (
                <div className="admin-modal">
                    <div className="admin-modal-content">
                        <h3>Create New Admin</h3>
                        <Input
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={newAdmin.username}
                            onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                        />
                        <Input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={newAdmin.email}
                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={newAdmin.password}
                            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                        />
                        <div className="modal-buttons">
                            <Button color="success" onClick={handleCreateAdmin}>Create</Button>
                            <Button color="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                        </div>
                    </div>
                </div>
            )}

            <Table striped responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((admin) => (
                        <tr key={admin.id}>
                            <td>{admin.id}</td>
                            <td>{editableId === admin.id ? (
                                <Input name="username" value={adminData.username} onChange={handleInputChange} />
                            ) : admin.username}</td>
                            <td>{editableId === admin.id ? (
                                <Input name="email" value={adminData.email} onChange={handleInputChange} />
                            ) : admin.email}</td>
                            <td>{editableId === admin.id ? (
                                <Input name="password" value={adminData.password} onChange={handleInputChange} />
                            ) : '••••••••'}</td>
                            <td>
                                {editableId === admin.id ? (
                                    <Button color="success" onClick={handleSave}><i className="fas fa-check"></i></Button>
                                ) : (
                                    <>
                                        <Button color="warning" size="sm" onClick={() => handleEdit(admin)}>
                                            <i className="fas fa-wrench"></i>
                                        </Button>{' '}
                                        <Button color="danger" size="sm" onClick={() => handleDelete(admin.id)}>
                                            <i className="fas fa-times"></i>
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default AdminTablePage;
