'use client';

import { useState, useEffect } from 'react';
import React from 'react';

interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
}

interface Assignment {
  id: number;
  title: string;
  instructions: string;
  deadline: string;
  max_points: number;
  allow_file_upload: boolean;
  allow_text_submission: boolean;
  allow_coding_exercise: boolean;
}

interface Submission {
  id: number;
  assignment_id: number;
  submission_text: string | null;
  file_name: string | null;
  status: string;
  grade: number | null;
  feedback: string | null;
  submitted_at: string | null;
  graded_at: string | null;
}

export default function StudentModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [sessionToken, setSessionToken] = useState('');
  const [courseId, setCourseId] = useState(1);

  // submission form
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Get session token (actually retrieved from the login function)
    const token = localStorage.getItem('session_token') || 'demo_token';
    setSessionToken(token);
    
    // Get modules list
    loadModules(token);
    // get my submission
    loadMySubmissions(token);
  }, [courseId]);

  const loadModules = async (token: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/courses/${courseId}/modules?session_token=${token}`);
      if (response.ok) {
        const data = await response.json();
        setModules(data);
      }
    } catch (error) {
      console.error('Failed to load modules:', error);
    }
  };

  const loadAssignments = async (moduleId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/modules/${moduleId}/assignments?session_token=${sessionToken}`);
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error('Failed to load assignments:', error);
    }
  };

  const loadMySubmissions = async (token: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/my-submissions?session_token=${token}`);
      if (response.ok) {
        const data = await response.json();
        setMySubmissions(data);
      }
    } catch (error) {
      console.error('Failed to load submissions:', error);
    }
  };

  const getSubmissionForAssignment = (assignmentId: number): Submission | undefined => {
    return mySubmissions.find(s => s.assignment_id === assignmentId);
  };

  const submitAssignment = async () => {
    if (!selectedAssignment) return;

    const formData = new FormData();
    formData.append('assignment_id', selectedAssignment.id.toString());
    formData.append('session_token', sessionToken);
    
    if (submissionText) {
      formData.append('submission_text', submissionText);
    }
    
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      const response = await fetch('http://localhost:8000/api/submissions', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Submitted!');
        setShowSubmitForm(false);
        setSubmissionText('');
        setSelectedFile(null);
        loadMySubmissions(sessionToken);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Failed to submit assignment:', error);
      alert('Failed to submit assignment');
    }
  };

  const isDeadlinePassed = (deadline: string): boolean => {
    return new Date(deadline) < new Date();
  };

  const getTimeUntilDeadline = (deadline: string): string => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();

    if (diff < 0) return 'passed the deadline';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `Remaining ${days}days ${hours}hours`;
    return `remaining ${hours}hours`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Student - Assingments list</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* list of modules and assignments */}
          <div className="space-y-6">
            {modules.map((module) => (
              <div key={module.id} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">{module.title}</h2>
                {module.description && (
                  <p className="text-gray-600 mb-4">{module.description}</p>
                )}

                <div className="space-y-3">
                  {assignments
                    .filter(a => a.module_id === module.id)
                    .map((assignment) => {
                      const submission = getSubmissionForAssignment(assignment.id);
                      const deadlinePassed = isDeadlinePassed(assignment.deadline);

                      return (
                        <div
                          key={assignment.id}
                          className="p-4 rounded border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                          onClick={() => setSelectedAssignment(assignment)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-lg">{assignment.title}</h3>
                            {submission ? (
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                submission.status === 'graded'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {submission.status === 'graded' ? 'Graded' : 'Submitted'}
                              </span>
                            ) : (
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                deadlinePassed
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {deadlinePassed ? 'Passed the dealine' : 'No submission'}
                              </span>
                            )}
                          </div>

                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              Deadline: {new Date(assignment.deadline).toLocaleString('ja-JP', { timeZone: 'America/Phoenix' })}
                              <span className={`ml-2 font-medium ${
                                deadlinePassed ? 'text-red-600' : 'text-blue-600'
                              }`}>
                                ({getTimeUntilDeadline(assignment.deadline)})
                              </span>
                            </p>
                            <p>Max points: {assignment.max_points}</p>
                            {submission?.grade != null && (
                              <p className="font-medium text-green-600">
                                Your Score: {submission.grade}/{assignment.max_points}
                              </p>
                            )}
                          </div>

                          {!submission && !deadlinePassed && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAssignment(assignment);
                                setShowSubmitForm(true);
                              }}
                              className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                              Submit
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>

                <button
                  onClick={() => {
                    setSelectedModule(module);
                    loadAssignments(module.id);
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Load the assignment of this module →
                </button>
              </div>
            ))}
          </div>

          {/* Assignment details / Submisison status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Details</h2>

            {selectedAssignment ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{selectedAssignment.title}</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedAssignment.instructions}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Assignment infomation</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Deadline: {new Date(selectedAssignment.deadline).toLocaleString('ja-JP', { timeZone: 'America/Phoenix' })}</p>
                    <p>Max points: {selectedAssignment.max_points}</p>
                    <p>ways to submit:</p>
                    <ul className="list-disc list-inside ml-4">
                      {selectedAssignment.allow_text_submission && <li>Text submission</li>}
                      {selectedAssignment.allow_file_upload && <li>upload file (PDF, DOCX)</li>}
                      {selectedAssignment.allow_coding_exercise && <li>Coding</li>}
                    </ul>
                  </div>
                </div>

                {(() => {
                  const submission = getSubmissionForAssignment(selectedAssignment.id);
                  if (submission) {
                    return (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Your submission</h4>
                        <div className="bg-gray-50 p-4 rounded space-y-2">
                          <p className="text-sm">
                            <span className="font-medium">Status:</span>{' '}
                            <span className={`${
                              submission.status === 'graded' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {submission.status === 'graded' ? 'graded' : 'submitted'}
                            </span>
                          </p>
                          {submission.submitted_at && (
                            <p className="text-sm">
                              <span className="font-medium">submission deadline:</span>{' '}
                              {new Date(submission.submitted_at).toLocaleString('ja-JP')}
                            </p>
                          )}
                          {submission.file_name && (
                            <p className="text-sm">
                              <span className="font-medium">file:</span> {submission.file_name}
                            </p>
                          )}
                          {submission.submission_text && (
                            <div>
                              <p className="text-sm font-medium">Submission text:</p>
                              <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                                {submission.submission_text}
                              </p>
                            </div>
                          )}
                          {submission.grade !== null && (
                            <div className="border-t pt-2 mt-2">
                              <p className="text-sm font-medium text-green-600">
                                Points: {submission.grade}/{selectedAssignment.max_points}
                              </p>
                              {submission.feedback && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium">Feedback:</p>
                                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                                    {submission.feedback}
                                  </p>
                                </div>
                              )}
                              {submission.graded_at && (
                                <p className="text-sm text-gray-600 mt-2">
                                  採点日: {new Date(submission.graded_at).toLocaleString('ja-JP')}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {!getSubmissionForAssignment(selectedAssignment.id) && 
                 !isDeadlinePassed(selectedAssignment.deadline) && (
                  <button
                    onClick={() => setShowSubmitForm(true)}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 font-medium"
                  >
                    Submit this assignment
                  </button>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Select assignment</p>
            )}
          </div>
        </div>

        {/* submission form */}
        {showSubmitForm && selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">Submit assignment: {selectedAssignment.title}</h3>
              
              <div className="space-y-4">
                {selectedAssignment.allow_text_submission && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Text submission (optional)</label>
                    <textarea
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      rows={6}
                      placeholder="Enter your answer or explanation here..."
                    />
                  </div>
                )}

                {selectedAssignment.allow_file_upload && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      upload file (optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-blue-600 hover:text-blue-800"
                      >
                        Select the file (PDF, DOCX)
                      </label>
                      {selectedFile && (
                        <p className="mt-2 text-sm text-gray-600">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Caution:</strong> You can update your submission before the deadline, but you can't change after it's graded
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={submitAssignment}
                    disabled={!submissionText && !selectedFile}
                    className={`flex-1 px-4 py-3 rounded font-medium ${
                      submissionText || selectedFile
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => {
                      setShowSubmitForm(false);
                      setSubmissionText('');
                      setSelectedFile(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-3 rounded hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}