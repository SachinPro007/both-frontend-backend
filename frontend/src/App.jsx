import React, { useState, useEffect } from "react";
import {
  addItemToServer,
  deleteItemFromServer,
  getItemsFromServer,
  toggleItemOnServer,
  updateItemFromServer,
} from "./services/itemService";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    (async () => {
      const allTodoItems = await getItemsFromServer();
      setTodos(allTodoItems.todos);
    })();
  }, []);

  const addTodo = async () => {
    if (inputValue.trim() !== "") {
      const newTodo = await addItemToServer(inputValue);
      setTodos([newTodo, ...todos]);
      setInputValue("");
    }
  };

  const toggleTodo = async (id, completed) => {
    const res = await toggleItemOnServer({ id, completed });
    if (res) {
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, completed: !completed } : todo,
        ),
      );
    }
  };

  const deleteTodo = async (id) => {
    const res = await deleteItemFromServer(id);
    if (res) {
      setTodos(todos.filter((todo) => todo._id !== id));
      setShowDeleteConfirm(null);
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditInput(todo.text);
  };

  const saveEdit = async (id) => {
    if (editInput.trim() !== "") {
      const res = await updateItemFromServer({ id, text: editInput });
      if (res) {
        setTodos(
          todos.map((todo) =>
            todo._id === id ? { ...todo, text: editInput } : todo,
          ),
        );
        setEditingId(null);
        setEditInput("");
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditInput("");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {totalCount === 0
                    ? "Get started by adding a task"
                    : `${completedCount} of ${totalCount} completed`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-2 text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none text-base"
              />
              <button
                onClick={addTodo}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4">
          {["all", "active", "completed"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`pb-2 px-1 font-medium text-sm transition-all border-b-2 ${
                filter === filterType
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500 font-medium">
                {filter === "completed" ? "No completed tasks" : "No tasks"}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {filter === "all"
                  ? "Create your first task to get started"
                  : "Try another filter"}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {filteredTodos.map((todo, index) => (
                <div
                  key={todo._id}
                  className={`flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors ${
                    index !== filteredTodos.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTodo(todo._id, todo.completed)}
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      todo.completed
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 hover:border-blue-500"
                    }`}
                  >
                    {todo.completed && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Task Text */}
                  {editingId === todo._id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && saveEdit(todo._id)
                        }
                        autoFocus
                        className="flex-1 px-3 py-1 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                      />
                      <button
                        onClick={() => saveEdit(todo._id)}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`flex-1 text-base transition-all ${
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-900"
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-auto">
                    {editingId !== todo._id && (
                      <button
                        onClick={() => startEdit(todo)}
                        disabled={todo.completed}
                        className={`p-1.5 rounded-lg transition-colors ${
                          todo.completed
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                        title="Edit"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => setShowDeleteConfirm(todo._id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Delete Confirmation */}
                  {showDeleteConfirm === todo._id && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
                        <p className="text-gray-900 font-semibold mb-4">
                          Delete this task?
                        </p>
                        <div className="flex gap-3 justify-end">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => deleteTodo(todo._id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {totalCount > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
              <p className="text-sm text-gray-500 mt-1">Total Tasks</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {completedCount}
              </p>
              <p className="text-sm text-gray-500 mt-1">Completed</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">
                {totalCount - completedCount}
              </p>
              <p className="text-sm text-gray-500 mt-1">Remaining</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TodoApp;
