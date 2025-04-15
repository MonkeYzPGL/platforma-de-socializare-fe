import React, { useEffect, useState } from 'react';
import { Table, Button, Input } from 'reactstrap';
import './UserTablePage.css'; 

const UserTablePage = ({ fetchUsers, updateUser, deleteUser }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [editableUserId, setEditableUserId] = useState(null);
    const [userData, setUserData] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers().then(data => setAllUsers(data));
    }, [fetchUsers]);

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
        updateUser(userData).then(() => {
            setEditableUserId(null);
            fetchUsers().then(data => setAllUsers(data));
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUser(id).then(() => {
                fetchUsers().then(data => setAllUsers(data));
            });
        }
    };

    const filteredUsers = allUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="user-table-container">
            <Input
                type="text"
                placeholder="Search by name or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />
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
                                        type="password"
                                        value={userData.password}
                                        onChange={handleInputChange}
                                    />
                                ) : '••••••••'}
                            </td>
                            <td>
                                {editableUserId === user.id ? (
                                    <Button color="success" onClick={handleSave}>Save</Button>
                                ) : (
                                    <>
                                        <Button color="warning" size="sm" onClick={() => handleEditClick(user)}>Edit</Button>{' '}
                                        <Button color="danger" size="sm" onClick={() => handleDelete(user.id)}>Delete</Button>
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
