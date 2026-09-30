import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosCalls/axios";
import { useAuth } from "../context/AuthContext";

function Profile() {
    const { username } = useParams()
    const { user } = useAuth()
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('posts')
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editForm, setEditForm] = useState({ name: '', username: '', email: '', bio: '' })
    const [selectedImage, setSelectedImage] = useState(null)
    const [previewImage, setPreviewImage] = useState('')

    const openEditProfile = () => {
        setEditForm({
            name: userData?.name || '',
            username: userData?.username || '',
            email: userData?.email || '',
            bio: userData?.bio || ''
        })
        setSelectedImage(null)
        setPreviewImage('')
        setIsEditOpen(true)
    }

    const handleEditChange = (event) => {
        const { name, value } = event.target
        setEditForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        setSelectedImage(file)
        const previewUrl = URL.createObjectURL(file)
        setPreviewImage(previewUrl)
    }

    const handleEditSubmit = (event) => {
        event.preventDefault()
        setUserData((prev) => ({ 
            ...prev, 
            ...editForm,
            profileImage: previewImage || prev.profileImage
        }))
        setIsEditOpen(false)
    }

    const profileUsername = username || user?.username

    useEffect(() => {
        const fetchProfile = async () => {
            if (!profileUsername) return;
            try {
                const response = await axiosInstance.get(`/users/profile/${profileUsername}`)
                setUserData(response.data.userData)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [profileUsername])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-gray-500 font-medium">User not found</div>
            </div>
        )
    }

    // Fallback avatar using ui-avatars if profileImage is missing
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.username)}&background=random&size=150`

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                {/* Profile Header Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Cover Photo */}
                    <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 w-full relative">
                        {/* Profile Avatar */}
                        <div className="absolute -bottom-16 left-8">
                            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                                <img
                                    src={userData.profileImage || defaultAvatar}
                                    alt={userData.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="pt-20 pb-8 px-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
                                <p className="text-lg text-gray-500 font-medium">@{userData.username}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                {user?._id === userData._id ? (
                                    <button 
                                        onClick={openEditProfile}
                                        className="px-6 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold rounded-full transition-colors shadow-sm"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <button
                                        onClick={async () => {
                                            const isFollowing = userData.followers?.some(f => f._id === user?._id);
                                            try {
                                                if (isFollowing) {
                                                    await axiosInstance.delete(`/users/${userData._id}/follow`);
                                                    setUserData(prev => ({
                                                        ...prev,
                                                        followers: prev.followers.filter(f => f._id !== user._id)
                                                    }));
                                                } else {
                                                    await axiosInstance.post(`/users/${userData._id}/follow`);
                                                    setUserData(prev => ({
                                                        ...prev,
                                                        followers: [...(prev.followers || []), { _id: user._id, name: user.name, username: user.username, profileImage: user.profileImage }]
                                                    }));
                                                }
                                            } catch (error) {
                                                console.error("Error toggling follow status:", error);
                                            }
                                        }}
                                        className={`px-6 py-2 font-semibold rounded-full transition-colors shadow-sm ${userData.followers?.some(f => f._id === user?._id)
                                                ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                                : "bg-gray-900 hover:bg-gray-800 text-white"
                                            }`}
                                    >
                                        {userData.followers?.some(f => f._id === user?._id) ? 'Unfollow' : 'Follow'}
                                    </button>
                                )}
                                <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-full transition-colors">
                                    Message
                                </button>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <div className="mt-6 max-w-2xl">
                            <p className="text-gray-700 text-base leading-relaxed">
                                {userData.bio || "This user hasn't written a bio yet. They are probably too busy being awesome!"}
                            </p>
                        </div>

                        {/* Stats Section */}
                        <div className="flex items-center gap-8 mt-8 border-t border-gray-100 pt-6">
                            <div className="flex flex-col items-center sm:items-start cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveTab('posts')}>
                                <span className="text-2xl font-bold text-gray-900">{userData.posts?.length || 0}</span>
                                <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">Posts</span>
                            </div>
                            <div className="flex flex-col items-center sm:items-start cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveTab('followers')}>
                                <span className="text-2xl font-bold text-gray-900">{userData.followers?.length || 0}</span>
                                <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">Followers</span>
                            </div>
                            <div className="flex flex-col items-center sm:items-start cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveTab('following')}>
                                <span className="text-2xl font-bold text-gray-900">{userData.followings?.length || 0}</span>
                                <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">Following</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs / Content Section Placeholder */}
                <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                    <div className="border-b border-gray-100 pb-4 mb-6">
                        <ul className="flex space-x-8">
                            <li 
                                onClick={() => setActiveTab('posts')}
                                className={`${activeTab === 'posts' ? 'text-purple-600 font-semibold border-b-2 border-purple-600' : 'text-gray-500 font-medium hover:text-gray-900'} pb-4 -mb-[26px] cursor-pointer transition-colors`}>
                                Posts
                            </li>
                            <li 
                                onClick={() => setActiveTab('followers')}
                                className={`${activeTab === 'followers' ? 'text-purple-600 font-semibold border-b-2 border-purple-600' : 'text-gray-500 font-medium hover:text-gray-900'} pb-4 -mb-[26px] cursor-pointer transition-colors`}>
                                Followers
                            </li>
                            <li 
                                onClick={() => setActiveTab('following')}
                                className={`${activeTab === 'following' ? 'text-purple-600 font-semibold border-b-2 border-purple-600' : 'text-gray-500 font-medium hover:text-gray-900'} pb-4 -mb-[26px] cursor-pointer transition-colors`}>
                                Following
                            </li>
                        </ul>
                    </div>
                    
                    {/* Content Section */}
                    {activeTab === 'posts' && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <div className="w-16 h-16 mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No Posts Yet</h3>
                            <p className="mt-1 text-sm text-gray-500">When this user posts, you'll see them here.</p>
                        </div>
                    )}

                    {activeTab === 'followers' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userData.followers?.length > 0 ? (
                                userData.followers.map(f => (
                                    <div key={f._id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-sm transition-shadow cursor-pointer">
                                        <img src={f.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name || f.username)}&background=random&size=150`} alt={f.username} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">{f.name}</p>
                                            <p className="text-sm text-gray-500 truncate">@{f.username}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-400">
                                    <p className="mt-1 text-base text-gray-500">No followers yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'following' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userData.followings?.length > 0 ? (
                                userData.followings.map(f => (
                                    <div key={f._id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-sm transition-shadow cursor-pointer">
                                        <img src={f.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name || f.username)}&background=random&size=150`} alt={f.username} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">{f.name}</p>
                                            <p className="text-sm text-gray-500 truncate">@{f.username}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-400">
                                    <p className="mt-1 text-base text-gray-500">Not following anyone yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            {user?._id === userData._id && isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm transition-all">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                                <p className="text-sm text-gray-500 mt-1">Update your profile details.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsEditOpen(false)}
                                className="text-gray-400 hover:text-gray-700 text-3xl leading-none transition-colors"
                                aria-label="Close edit profile"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Profile Picture</label>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={previewImage || userData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(editForm.name || 'User')}&background=random&size=150`}
                                        alt="Profile preview"
                                        className="w-20 h-20 rounded-full object-cover border border-gray-200"
                                    />
                                    <div>
                                        <label className="inline-flex cursor-pointer items-center rounded-full bg-gray-100 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                                            Choose Image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                        {selectedImage && (
                                            <p className="mt-2 max-w-xs truncate text-xs text-gray-500 font-medium">
                                                {selectedImage.name}
                                            </p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-400 font-medium">Image upload is UI-only for now.</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditChange}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all bg-gray-50 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={editForm.username}
                                    onChange={handleEditChange}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all bg-gray-50 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all bg-gray-50 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
                                <textarea
                                    name="bio"
                                    value={editForm.bio}
                                    onChange={handleEditChange}
                                    rows="4"
                                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all bg-gray-50 focus:bg-white"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
                                    className="px-6 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors shadow-md"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile