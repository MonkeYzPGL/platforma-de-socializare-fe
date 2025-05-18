import React, { useEffect, useState } from 'react';
import { Table, Button, Input } from 'reactstrap';
import { getAllUsers, deleteUser, updateUser } from '../../API/user-account';
import { validateUser } from '../../API/admin-account';
import { useHistory } from "react-router-dom";
import './UserTable.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import ClickableLogo from "../../ClickableLogo";

const UserTablePage = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [editableUserId, setEditableUserId] = useState(null);
    const [userData, setUserData] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const history = useHistory();

    useEffect(() => {
        getAllUsers((result, status, error) => {
            if (status === 200 && result) {
                setAllUsers(result);
            } else {
                console.error("Eroare la preluarea userilor:", error);
            }
        });
    }, []);    

    const handleLogout = () => {
        localStorage.removeItem("admin");  
        history.push("/");                 
      };      

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditClick = (user) => {
        setEditableUserId(user.id);
        setUserData(user);
    };

    const handleSave = () => {
        updateUser(userData, (result, status, error) => {
            if (status === 200) {
                setEditableUserId(null);
                getAllUsers((result, status, error) => {
                    if (status === 200 && result) setAllUsers(result);
                });
            } else {
                console.error("Eroare la actualizare:", error);
            }
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUser(id, (result, status, error) => {
                if (status === 200) {
                    getAllUsers((result, status, error) => {
                        if (status === 200 && result) {
                            setAllUsers(result);
                        }
                    });
                } else {
                    console.error("Error at deleting the user:", error ?? `Status: ${status}`);
                    getAllUsers((result, status, error) => {
                        if (status === 200 && result) {
                            setAllUsers(result);
                        }
                    });
                }
            });
        }
    };

    const handleValidate = (id) => {
        validateUser(id, (result, status, error) => {
            if (status === 200) {
                getAllUsers((result, status, error) => {
                    if (status === 200 && result) setAllUsers(result);
                });
            } else {
                console.error("Eroare la validare:", error);
            }
        });
    };

    const filteredUsers = allUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="user-table-container">
            <ClickableLogo className="admin-logo" disableNavigation={true} />

            <div className="admin-buttons">
                <Button 
                    color="info" 
                    onClick={() => history.push('/admin-table')} 
                    style={{ marginRight: '1rem' }}
                >
                    Admin Table
                </Button>

                <Button 
                    color="info" 
                    onClick={() => history.push('/admin-feed')} 
                    style={{ backgroundColor: '#17a2b8', borderColor: '#17a2b8' }}
                >
                    Admin Feed
                </Button>

                <button 
                    className="logout-icon-button"
                    onClick={handleLogout}
                    title="Log Out"
                >
                    <i className="fas fa-sign-out-alt"></i>
                </button>
            </div>

            <div className="search-wrapper">
                <input
                    type="text"
                    placeholder="Search by name or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />
            </div>

            <Table striped responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First</th>
                        <th>Last</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Description</th>
                        <th>Blocked</th>
                        <th>Validated</th>
                        <th>Password</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>
                                {editableUserId === user.id ? (
                                    <Input
                                        name="firstName"
                                        value={userData.firstName}
                                        onChange={handleInputChange}
                                    />
                                ) : user.firstName}
                            </td>
                            <td>
                                {editableUserId === user.id ? (
                                    <Input
                                        name="lastName"
                                        value={userData.lastName}
                                        onChange={handleInputChange}
                                    />
                                ) : user.lastName}
                            </td>
                            <td>
                                {editableUserId === user.id ? (
                                    <Input
                                        name="username"
                                        value={userData.username}
                                        onChange={handleInputChange}
                                    />
                                ) : user.username}
                            </td>
                            <td>
                                {editableUserId === user.id ? (
                                    <Input
                                        name="email"
                                        value={userData.email}
                                        onChange={handleInputChange}
                                    />
                                ) : user.email}
                            </td>
                            <td>
                                {editableUserId === user.id ? (
                                    <Input
                                        name="description"
                                        value={userData.description}
                                        onChange={handleInputChange}
                                    />
                                ) : user.description}
                            </td>
                            <td>
                                {editableUserId === user.id ? (
                                    <Input
                                        type="checkbox"
                                        name="blockedFlag"
                                        checked={userData.blockedFlag}
                                        onChange={handleInputChange}
                                    />
                                ) : user.blockedFlag ? "Yes" : "No"}
                            </td>
                            <td>
                                {editableUserId === user.id ? (
                                    <Input
                                        type="checkbox"
                                        name="validated"
                                        checked={userData.validated}
                                        onChange={handleInputChange}
                                    />
                                ) : user.validated ? "Yes" : "No"}
                            </td>
                            <td>
                                {editableUserId === user.id ? (
                                    <Input
                                        name="password"
                                        type="text"
                                        value={userData.password}
                                        onChange={handleInputChange}
                                    />
                                ) : '••••••••'}
                            </td>
                            <td>
                                {editableUserId === user.id ? (
                                    <Button color="success" onClick={handleSave}>
                                        <i className="fas fa-check"></i>
                                    </Button>

                                ) : (
                                    <>
                                        <Button color="primary" size="sm" onClick={() => handleValidate(user.id)}>
                                            <i className="fas fa-check-circle"></i>
                                        </Button>{' '}
                                        <Button color="warning" size="sm" onClick={() => handleEditClick(user)}>
                                            <i className="fas fa-wrench"></i>
                                        </Button>{' '}
                                        <Button color="danger" size="sm" onClick={() => handleDelete(user.id)}>
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

export default UserTablePage;