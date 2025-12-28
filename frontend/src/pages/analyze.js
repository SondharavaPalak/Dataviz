import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  Upload, FileText, BarChart3, Download, Trash2,AlertCircle,
  CheckCircle, X, ChevronRight, Loader2, Sparkles, Database, Zap,AlertTriangle
} from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Select from 'react-select';

const DataAnalysisApp = () => {
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [insights, setInsights] = useState([]);
  const [graphs, setGraphs] = useState([]);
  const [showInsights, setShowInsights] = useState(true);
  const [showGraphs, setShowGraphs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState(null);
  const [selectedGraphType, setSelectedGraphType] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);

  // Get all unique graph types and columns from graphs
  const graphTypes = Array.from(new Set(graphs.map(g => g.graph_type)));
  const allColumns = Array.from(new Set(graphs.flatMap(g => g.columns || g.column_names || [])));
  const columnOptions = [{ value: '__all__', label: 'All Columns' }, ...allColumns.map(col => ({ value: col, label: col }))];

  // Filtered graphs
  const filteredGraphs = graphs.filter(g => {
    const typeMatch = !selectedGraphType || g.graph_type === selectedGraphType;
    const columnsMatch =
      selectedColumns.length === 0 ||
      selectedColumns.includes('__all__') ||
      (g.columns || g.column_names || []).some(col => selectedColumns.includes(col));
    return typeMatch && columnsMatch;
  });

  const API_BASE = 'http://127.0.0.1:8000/api';

  function getToken() {
    return localStorage.getItem('token');
  }

  function getUserFromToken() {
    const token = getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchAnalyses();
      setIsLoading(false);
    };
    fetchData();
    
    const interval = setInterval(fetchAnalyses, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalyses = async () => {
    try {
      const token = getToken();
      if (!token) {
        setAnalyses([]);
        return;
      }
      const response = await fetch(`${API_BASE}/analyses/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      // Optionally filter by user id if backend does not filter
      const user = getUserFromToken();
      let filtered = Array.isArray(data) ? data : (Array.isArray(data.results) ? data.results : []);
      if (user && user.user_id) {
        filtered = filtered.filter(a => a.user === user.user_id || a.user_id === user.user_id);
      }
      setAnalyses(filtered);
    } catch (error) {
      console.error('Error fetching analyses:', error);
      setAnalyses([]);
    }
  };
  const promptDeleteAnalysis = (analysisId) => {
    setAnalysisToDelete(analysisId);
    setShowDeleteConfirm(true);
  };
  const deleteAnalysis = async () => {
    if (!analysisToDelete) return;
    
    try {
      const response = await fetch(`${API_BASE}/analyses/${analysisToDelete}/delete/`, { 
        method: 'DELETE' 
      });
      
      if (response.ok) {
        setAnalyses(prev => prev.filter(a => a.id !== analysisToDelete));
        if (selectedAnalysis?.id === analysisToDelete) {
          setSelectedAnalysis(null);
          setInsights([]);
          setGraphs([]);
        }
        setUploadStatus({ type: 'success', message: 'Analysis deleted successfully' });
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setUploadStatus({ type: 'error', message: 'Failed to delete analysis' });
    } finally {
      setShowDeleteConfirm(false);
      setAnalysisToDelete(null);
    }
  };
  const fetchAnalysisDetails = async (analysisId) => {
    try {
      setIsLoading(true);
      const [analysisRes, insightsRes, graphsRes] = await Promise.all([
        fetch(`${API_BASE}/analyses/${analysisId}/`),
        fetch(`${API_BASE}/analyses/${analysisId}/insights/`),
        fetch(`${API_BASE}/analyses/${analysisId}/graphs/`)
      ]);

      if (!analysisRes.ok) throw new Error('Failed to fetch analysis');
      const analysis = await analysisRes.json();

      // Process insights
      let insightsData = [];
      if (insightsRes.ok) {
        try {
          const json = await insightsRes.json();
          insightsData = Array.isArray(json) ? json : (Array.isArray(json.results) ? json.results : []);
        } catch (e) {
          console.error('Error parsing insights:', e);
        }
      }

      // Process graphs
      let graphsData = [];
      if (graphsRes.ok) {
        try {
          const json = await graphsRes.json();
          graphsData = Array.isArray(json) ? json : (Array.isArray(json.results) ? json.results : []);
        } catch (e) {
          console.error('Error parsing graphs:', e);
        }
      }

      setSelectedAnalysis(analysis);
      setInsights(insightsData);
      setGraphs(graphsData);
      setShowInsights(true);
      setShowGraphs(false);
    } catch (error) {
      console.error('Error fetching details:', error);
      setUploadStatus({ type: 'error', message: 'Failed to load analysis details' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      setUploadStatus({ type: 'error', message: 'File size exceeds 50MB limit' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('dataset_name', file.name);

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/upload/`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');

      setUploadStatus({ type: 'success', message: 'Upload successful! Analysis started...' });
      setAnalyses(prev => [data, ...prev]);
    } catch (error) {
      setUploadStatus({ type: 'error', message: error.message || 'Upload failed' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (analysisId) => {
    try {
      const response = await fetch(`${API_BASE}/analyses/${analysisId}/download/results/`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analysis_${analysisId}_results.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Download error:", err);
      setUploadStatus({ type: 'error', message: 'Download failed' });
    }
  };

  const viewHtmlReport = (reportPath) => {
    if (!reportPath) {
      setUploadStatus({ type: 'error', message: 'HTML report not available' });
      return;
    }
    window.open(`${API_BASE}${reportPath}`, "_blank");
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize";
    switch (status) {
      case 'completed': return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
      case 'processing': return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{status}</span>;
      case 'failed': return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
      default: return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
    <Navbar/>
    <div className="mt-20 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Delete Analysis</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this analysis? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setAnalysisToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteAnalysis}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with animated gradient */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3">
            DataViz Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your datasets and get automated insights, visualizations, and reports in seconds
          </p>
        </div>

        {/* Upload Section with drag-and-drop feel */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200 hover:border-blue-300 transition-all duration-200">
          <div className="flex items-center mb-4">
            <Database className="w-6 h-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Upload Dataset</h2>
          </div>
          
          <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 
            ${isUploading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50'}`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <Loader2 className="w-10 h-10 mb-3 text-blue-500 animate-spin" />
              ) : (
                <Upload className="w-10 h-10 mb-3 text-gray-400 group-hover:text-blue-500" />
              )}
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV, Excel, JSON (MAX. 50MB)</p>
              <p className="mt-2 text-xs text-blue-500 flex items-center">
                <Zap className="w-3 h-3 mr-1" /> Powered by AI analysis
              </p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".csv,.xlsx,.xls,.json" 
              onChange={handleFileUpload} 
              disabled={isUploading} 
            />
          </label>

          {uploadStatus && (
            <div className={`mt-4 p-3 rounded-lg flex items-center ${uploadStatus.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {uploadStatus.type === 'success' 
                ? <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" /> 
                : <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />}
              <span className="text-sm">{uploadStatus.message}</span>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Analyses List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-500" />
                  Recent Analyses
                </h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {analyses.length} total
                </span>
              </div>

              {isLoading && analyses.length === 0 ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              ) : analyses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No analyses yet</p>
                  <p className="text-sm text-gray-400">Upload a file to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analyses.map((a) => (
                    <div 
                      key={a.id} 
                      className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md
                        ${selectedAnalysis?.id === a.id 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-200'}`}
                      onClick={() => fetchAnalysisDetails(a.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 truncate max-w-[180px]">
                            {a.dataset_name || 'Unnamed Dataset'}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(a.created_at)}
                          </p>
                        </div>
                        {getStatusBadge(a.status)}
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              viewHtmlReport(a.report_html);
                            }}
                            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                            title="View Report"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(a.id);
                            }}
                            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-green-600"
                            title="Download Results"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
          onClick={(e) => {
            e.stopPropagation();
            promptDeleteAnalysis(a.id);
          }}
          className="p-1.5 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-600"
          title="Delete Analysis"
        >
          <Trash2 className="w-4 h-4" />
        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-2">
            {selectedAnalysis ? (
              <div className="bg-white rounded-xl shadow-md p-6 h-full">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      {selectedAnalysis.dataset_name}
                      <ChevronRight className="w-5 h-5 mx-1 text-gray-400" />
                      <span className="text-lg font-medium text-gray-600">
                        {showInsights ? 'Key Insights' : 'Visualizations'}
                      </span>
                    </h2>
                    <div className="flex items-center mt-1 space-x-3">
                      {getStatusBadge(selectedAnalysis.status)}
                      <span className="text-sm text-gray-500">
                        Created: {formatDate(selectedAnalysis.created_at)}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedAnalysis(null)} 
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    onClick={() => { setShowInsights(true); setShowGraphs(false); }}
                    className={`px-4 py-2 font-medium text-sm flex items-center border-b-2 transition-colors
                      ${showInsights ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Insights
                  </button>
                  <button
                    onClick={() => { setShowInsights(false); setShowGraphs(true); }}
                    className={`px-4 py-2 font-medium text-sm flex items-center border-b-2 transition-colors
                      ${showGraphs ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Visualizations
                  </button>
                </div>

                {/* Content */}
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                ) : showInsights ? (
                  <div>
                    {insights.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500">No insights available for this dataset</p>
                        <p className="text-sm text-gray-400 mt-1">Try another analysis or check back later</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {insights.map((ins, i) => (
                          <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="font-medium text-blue-600 mb-1">
                              {ins.column_name || 'General Insight'}
                            </div>
                            <p className="text-gray-700">
                              {ins.description || JSON.stringify(ins)}
                            </p>
                            {ins.metrics && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                  {Object.entries(ins.metrics).map(([key, value]) => (
                                    <div key={key} className="bg-white p-2 rounded border">
                                      <div className="font-medium text-gray-500">{key}</div>
                                      <div className="text-gray-800 font-semibold truncate">
                                        {typeof value === 'number' ? value.toFixed(4) : value}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {/* Graph Filter*/}
                    <div className="mb-6 flex flex-wrap gap-4 items-center">
                      <label className="text-sm font-medium text-gray-700">Graph Type:</label>
                      <select
                        value={selectedGraphType}
                        onChange={e => setSelectedGraphType(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="">All</option>
                        {graphTypes.map(type => (
                          <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                        ))}
                      </select>
                      <label className="text-sm font-medium text-gray-700 ml-4">Columns:</label>
                      <div style={{ minWidth: 180, maxWidth: 320 }}>
                        <Select
                          options={columnOptions}
                          value={columnOptions.find(opt => selectedColumns.includes(opt.value))}
                          onChange={opt => {
                            if (!opt) {
                              setSelectedColumns([]);
                            } else {
                              setSelectedColumns([opt.value]);
                            }
                          }}
                          placeholder="Select a column..."
                          classNamePrefix="react-select"
                          isClearable
                        />
                      </div>
                      <button
                        className="ml-2 px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300"
                        onClick={() => { setSelectedGraphType(''); setSelectedColumns([]); }}
                        type="button"
                      >
                        Reset
                      </button>
                    </div>
                    {filteredGraphs.length === 0 ? (
                      <div className="text-center py-8">
                        <BarChart3 className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500">No visualizations available for this filter</p>
                        <p className="text-sm text-gray-400 mt-1">Try another filter or check back later</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredGraphs.map((g, i) => (
                          <div key={i} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <img
                              src={`${API_BASE}${g.graph_url}`}
                              alt={`${g.graph_type} - ${(g.columns || g.column_names || []).join(", ")}`}
                              className="w-full h-auto object-contain"
                            />
                            <div className="p-2 bg-gray-50 border-t">
                              <p className="text-xs text-gray-600 truncate">
                                {g.graph_type} • {(g.columns || g.column_names || []).join(", ")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 h-full flex flex-col items-center justify-center text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No analysis selected</h3>
                <p className="text-gray-500 max-w-md mb-4">
                  Select an analysis from the list to view detailed insights and visualizations
                </p>
                <div className="flex space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Sparkles className="w-3 h-3 mr-1" /> Insights
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <BarChart3 className="w-3 h-3 mr-1" /> Visualizations
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default DataAnalysisApp;