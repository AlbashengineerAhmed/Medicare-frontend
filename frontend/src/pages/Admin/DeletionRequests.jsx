import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { deletionRequestService } from '../../services/api';
import HashLoader from 'react-spinners/HashLoader';
import defaultAvatar from '../../assets/images/avatar-icon.png';
import { formatDate } from '../../utils/formatDate';
import { formatDoctorName } from '../../utils/formatDoctorName';
import { FaCheck, FaTimes, FaTrash, FaInfoCircle, FaUser, FaUserMd, FaCalendarAlt, FaCommentAlt } from 'react-icons/fa';

const DeletionRequests = () => {
  const [loading, setLoading] = useState(false);
  const [deletionRequests, setDeletionRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    fetchDeletionRequests();
  }, []);

  const fetchDeletionRequests = async () => {
    try {
      setLoading(true);
      const result = await deletionRequestService.getAllDeletionRequests();

      if (result.success) {
        setDeletionRequests(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to fetch deletion requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setAdminNotes('');
    setShowModal(true);
  };

  const handleProcessRequest = async () => {
    if (!selectedRequest || !actionType) return;

    try {
      setLoading(true);

      const result = await deletionRequestService.processDeletionRequest(
        selectedRequest._id,
        {
          status: actionType,
          adminNotes: adminNotes.trim() || `Request ${actionType} by admin`
        }
      );

      if (result.success) {
        toast.success(`Deletion request ${actionType} successfully`);
        setShowModal(false);
        fetchDeletionRequests();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Failed to ${actionType} deletion request. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-100 p-3 rounded-full">
          <FaTrash className="text-red-500 text-xl" />
        </div>
        <h3 className="text-[22px] leading-[30px] text-headingColor font-bold">
          Account Deletion Requests
        </h3>
      </div>

      {loading && deletionRequests.length === 0 ? (
        <div className="flex items-center justify-center h-[400px]">
          <HashLoader size={45} color="#0067FF" />
        </div>
      ) : deletionRequests.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FaTrash className="text-gray-300 text-4xl mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No deletion requests found</p>
          <p className="text-gray-400 text-sm mt-1">When users request account deletion, they will appear here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Reason</th>
                <th className="py-3 px-4 text-left">Requested On</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deletionRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={request.user?.photo || defaultAvatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {request.userModel === 'Doctor' 
                            ? formatDoctorName(request.user?.name || 'Unknown Doctor')
                            : request.user?.name || 'Unknown User'
                          }
                        </p>
                        <p className="text-sm text-gray-500">{request.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.userModel === 'Doctor' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {request.userModel === 'Doctor' ? <FaUserMd className="text-xs" /> : <FaUser className="text-xs" />}
                      {request.userModel}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="max-w-xs truncate" title={request.reason}>
                      {request.reason}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-gray-500">
                      <FaCalendarAlt className="text-gray-400 text-xs" />
                      {formatDate(request.createdAt)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                      {request.status === 'pending' && '⏳'}
                      {request.status === 'approved' && '✓'}
                      {request.status === 'rejected' && '✕'}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {request.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(request, 'approved')}
                          className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors"
                          title="Approve deletion request"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleOpenModal(request, 'rejected')}
                          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                          title="Reject deletion request"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenModal(request, 'view')}
                        className="bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 transition-colors"
                        title="View details"
                      >
                        <FaInfoCircle />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for approving/rejecting requests */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              {actionType === 'approved' && <FaCheck className="text-green-500" />}
              {actionType === 'rejected' && <FaTimes className="text-red-500" />}
              {actionType === 'view' && <FaInfoCircle className="text-blue-500" />}
              {actionType === 'view' 
                ? 'Deletion Request Details' 
                : `${actionType === 'approved' ? 'Approve' : 'Reject'} Deletion Request`}
            </h2>

            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={selectedRequest.user?.photo || defaultAvatar}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    {selectedRequest.userModel === 'Doctor' 
                      ? formatDoctorName(selectedRequest.user?.name || 'Unknown Doctor')
                      : selectedRequest.user?.name || 'Unknown User'
                    }
                  </p>
                  <p className="text-sm text-gray-500">{selectedRequest.user?.email}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-600 flex items-start gap-2">
                  <FaCommentAlt className="text-gray-400 mt-1 flex-shrink-0" />
                  <span>{selectedRequest.reason}</span>
                </p>
              </div>

              {actionType !== 'view' && (
                <div className="mb-4">
                  <label className="text-gray-700 font-medium mb-2 block">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this decision (optional)"
                    className="w-full px-4 py-3 border border-solid border-gray-300 focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor rounded-lg bg-gray-50"
                    rows={3}
                  />
                </div>
              )}

              {actionType === 'view' && selectedRequest.adminNotes && (
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-700 font-medium mb-1">Admin Notes:</p>
                  <p className="text-sm text-gray-600">{selectedRequest.adminNotes}</p>
                </div>
              )}

              {actionType === 'approved' && (
                <div className="bg-red-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                    <FaInfoCircle /> Warning: This action cannot be undone
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Approving this request will permanently delete the user's account and all associated data.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                {actionType === 'view' ? 'Close' : 'Cancel'}
              </button>
              
              {actionType !== 'view' && (
                <button
                  onClick={handleProcessRequest}
                  className={`px-4 py-2 ${
                    actionType === 'approved' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                  } text-white rounded-md flex items-center gap-2`}
                  disabled={loading}
                >
                  {loading ? (
                    <HashLoader size={20} color="#ffffff" />
                  ) : (
                    <>
                      {actionType === 'approved' ? <FaCheck /> : <FaTimes />}
                      {actionType === 'approved' ? 'Approve' : 'Reject'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletionRequests;
