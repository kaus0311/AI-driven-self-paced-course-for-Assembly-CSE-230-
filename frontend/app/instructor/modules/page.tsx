'use client';

import { useState, useEffect } from 'react';
import React from 'react';

interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  course_id: number;
}

interface Assignment {
  id: number;
  title: string;
  instructions: string;
  deadline: string;
  max_points: number;
  module_id: number;
  allow_file_upload: boolean;
  allow_text_submission: boolean;
  allow_coding_exercise: boolean;
}

interface Submission {
  id: number;
  assignment_id: number;
  student_id: number;
  submission_text: string | null;
  file_name: string | null;
  status: string;
  grade: number | null;
  feedback: string | null;
  submitted_at: string | null;
  graded_at: string | null;
}

export default function InstructorModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [sessionToken, setSessionToken] = useState('');
  const [courseId, setCourseId] = useState(1); 

  // module creation form
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    order: 0,
  });

  // Assignment creation form
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    instructions: '',
    deadline: '',
    max_points: 100,
    allow_file_upload: true,
    allow_text_submission: true,
    allow_coding_exercise: false,
  });

  // grading form
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeForm, setGradeForm] = useState({
    grade: 0,
    feedback: '',
  });

  useEffect(() => {
    // Get session token (actually retrieved from the login function)
    const token = localStorage.getItem('session_token') || 'demo_token';
    setSessionToken(token);
    
    // get all modules
    loadModules(token);
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

  const loadSubmissions = async (assignmentId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/assignments/${assignmentId}/submissions?session_token=${sessionToken}`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Failed to load submissions:', error);
    }
  };

  const createModule = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...moduleForm,
          course_id: courseId,
          session_token: sessionToken,
        }),
      });

      if (response.ok) {
        alert('Module created');
        setShowModuleForm(false);
        setModuleForm({ title: '', description: '', order: 0 });
        loadModules(sessionToken);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Failed to create module:', error);
      alert('Failed to create module');
    }
  };

  const createAssignment = async () => {
    if (!selectedModule) {
      alert('Select module');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...assignmentForm,
          module_id: selectedModule.id,
          session_token: sessionToken,
        }),
      });

      if (response.ok) {
        alert('assignment created');
        setShowAssignmentForm(false);
        setAssignmentForm({
          title: '',
          instructions: '',
          deadline: '',
          max_points: 100,
          allow_file_upload: true,
          allow_text_submission: true,
          allow_coding_exercise: false,
        });
        loadAssignments(selectedModule.id);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Failed to create assignment:', error);
      alert('Failed to create assignment');
    }
  };

  const gradeSubmission = async () => {
    if (!selectedSubmission) return;

    try {
      const response = await fetch(`http://localhost:8000/api/submissions/${selectedSubmission.id}/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...gradeForm,
          session_token: sessionToken,
        }),
      });

      if (response.ok) {
        alert('Graded');
        setShowGradeForm(false);
        setGradeForm({ grade: 0, feedback: '' });
        if (selectedAssignment) {
          loadSubmissions(selectedAssignment.id);
        }
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Failed to grade submission:', error);
      alert('Failed to grade submission');
    }
  };

  const deleteModule = async (moduleId: number) => {
    if (!confirm('Do you want to delete this module? ')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/modules/${moduleId}?session_token=${sessionToken}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('deleted module');
        loadModules(sessionToken);
        if (selectedModule?.id === moduleId) {
          setSelectedModule(null);
          setAssignments([]);
        }
      }
    } catch (error) {
      console.error('Failed to delete module:', error);
    }
  };

  const deleteAssignment = async (assignmentId: number) => {
    if (!confirm('Do you want to delete this assignment?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/assignments/${assignmentId}?session_token=${sessionToken}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('assignment deleted');
        if (selectedModule) {
          loadAssignments(selectedModule.id);
        }
        if (selectedAssignment?.id === assignmentId) {
          setSelectedAssignment(null);
          setSubmissions([]);
        }
      }
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Instructor - Manage module</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Module lists*/}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Module</h2>
              <button
                onClick={() => setShowModuleForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                add
              </button>
            </div>

            <div className="space-y-2">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className={`p-3 rounded cursor-pointer border ${
                    selectedModule?.id === module.id
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setSelectedModule(module);
                    loadAssignments(module.id);
                    setSelectedAssignment(null);
                    setSubmissions([]);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{module.title}</h3>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteModule(module.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment lists */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Assignment</h2>
              {selectedModule && (
                <button
                  onClick={() => setShowAssignmentForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  add
                </button>
              )}
            </div>

            {selectedModule ? (
              <div className="space-y-2">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className={`p-3 rounded cursor-pointer border ${
                      selectedAssignment?.id === assignment.id
                        ? 'bg-green-50 border-green-500'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      loadSubmissions(assignment.id);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-gray-600">
                          Deadline: {new Date(assignment.deadline).toLocaleString('ja-JP')}
                        </p>
                        <p className="text-sm text-gray-600">Max point: {assignment.max_points}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAssignment(assignment.id);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">Select module</p>
            )}
          </div>

          {/* Submission Lists */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Submission</h2>

            {selectedAssignment ? (
              <div className="space-y-2">
                {submissions.map((submission) => (
                  <div key={submission.id} className="p-3 rounded bg-gray-50 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">StudentID: {submission.student_id}</p>
                        <p className="text-sm text-gray-600">
                          Condition: <span className={`font-medium ${
                            submission.status === 'graded' ? 'text-green-600' :
                            submission.status === 'submitted' ? 'text-blue-600' :
                            'text-gray-600'
                          }`}>{
                            submission.status === 'graded' ? 'grated' :
                            submission.status === 'submitted' ? 'submitted' :
                            'not submitted'
                          }</span>
                        </p>
                        {submission.submitted_at && (
                          <p className="text-sm text-gray-600">
                            Submission: {new Date(submission.submitted_at).toLocaleString('ja-JP')}
                          </p>
                        )}
                        {submission.file_name && (
                          <p className="text-sm text-gray-600">file: {submission.file_name}</p>
                        )}
                        {submission.grade !== null && (
                          <p className="text-sm font-medium text-blue-600">Score: {submission.grade}</p>
                        )}
                      </div>
                      {submission.status === 'submitted' && (
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setGradeForm({
                              grade: 0,
                              feedback: '',
                            });
                            setShowGradeForm(true);
                          }}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                        >
                          grade
                        </button>
                      )}
                    </div>
                    {submission.feedback && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded">
                        <p className="text-sm text-gray-700">Feedback: {submission.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
                {submissions.length === 0 && (
                  <p className="text-gray-500 text-center">no submission</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center">Select the assignment</p>
            )}
          </div>
        </div>

        {/* Module creation form */}
        {showModuleForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Create new module</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Explanation</label>
                  <textarea
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Order</label>
                  <input
                    type="number"
                    value={moduleForm.order}
                    onChange={(e) => setModuleForm({ ...moduleForm, order: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={createModule}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    create
                  </button>
                  <button
                    onClick={() => setShowModuleForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assignment creation form */}
        {showAssignmentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">Create new assignment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Instruction</label>
                  <textarea
                    value={assignmentForm.instructions}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deadline</label>
                  <input
                    type="datetime-local"
                    value={assignmentForm.deadline}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, deadline: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max points</label>
                  <input
                    type="number"
                    value={assignmentForm.max_points}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, max_points: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={assignmentForm.allow_file_upload}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, allow_file_upload: e.target.checked })}
                      className="mr-2"
                    />
                    allow file upload
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={assignmentForm.allow_text_submission}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, allow_text_submission: e.target.checked })}
                      className="mr-2"
                    />
                    allow text submission
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={assignmentForm.allow_coding_exercise}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, allow_coding_exercise: e.target.checked })}
                      className="mr-2"
                    />
                    allow coding problem
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={createAssignment}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowAssignmentForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grading form */}
        {showGradeForm && selectedSubmission && selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Grade submission</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Points (Max: {selectedAssignment.max_points})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={selectedAssignment.max_points}
                    value={gradeForm.grade}
                    onChange={(e) => setGradeForm({ ...gradeForm, grade: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Feedback</label>
                  <textarea
                    value={gradeForm.feedback}
                    onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={gradeSubmission}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    Grade
                  </button>
                  <button
                    onClick={() => {
                      setShowGradeForm(false);
                      setSelectedSubmission(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
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