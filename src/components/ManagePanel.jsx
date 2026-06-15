import React, { useState } from 'react';
import { ArrowLeft, Save, Download, Plus, Trash2, Edit2, Check, AlertCircle } from 'lucide-react';

const ImageUploadInput = ({ label, value, onChange, accept = "image/*", fullWidth = false }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await fetch(`/api/upload-image?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file
      });
      const resData = await response.json();
      if (resData.success) {
        onChange(resData.url);
      } else {
        throw new Error(resData.error || 'Server upload failed');
      }
    } catch (err) {
      console.warn('Dev server upload failed, falling back to Base64:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={fullWidth ? "form-group-full" : "form-group"}>
      <label>{label}</label>
      <div className="upload-input-flex" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.25rem' }}>
        <input 
          type="text" 
          value={value || ''} 
          onChange={e => onChange(e.target.value)} 
          placeholder="Path or select file..."
          style={{ flex: 1, margin: 0 }}
        />
        <label className="btn btn-outline" style={{ margin: 0, padding: '0.85rem 1.25rem', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
          {isUploading ? 'Uploading...' : 'Upload'}
          <input 
            type="file" 
            accept={accept} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
        </label>
      </div>
    </div>
  );
};

export default function ManagePanel({ data, setData }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [editedData, setEditedData] = useState(JSON.parse(JSON.stringify(data)));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const tabs = [
    { id: 'profile', name: 'Profile & Contact' },
    { id: 'achievements', name: 'Achievements' },
    { id: 'projects', name: 'Projects' },
    { id: 'services', name: 'Services' },
    { id: 'photography', name: 'Photography' },
    { id: 'experience', name: 'Skills & Experience' },
    { id: 'education', name: 'Education' }
  ];

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/save-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedData, null, 2)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const resData = text ? JSON.parse(text) : { success: false, error: 'Empty response' };
      if (resData.success) {
        setData(editedData);
        showMessage('success', 'Portfolio data saved successfully directly to portfolio.json!');
      } else {
        throw new Error(resData.error || 'Server failed to save.');
      }
    } catch (err) {
      console.error(err);
      // Fallback: Local Storage saving
      setData(editedData);
      showMessage('warning', `Direct saving failed (${err.message}). Saved to current session, but changes will reset on page reload. Use "Download JSON" to save manually.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(editedData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "portfolio.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showMessage('success', 'portfolio.json downloaded! Place it in the "public" folder to overwrite your data.');
  };

  // Helper change handlers
  const handleProfileChange = (key, value) => {
    setEditedData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: value
      }
    }));
  };

  const handlePersonalInfoChange = (key, value) => {
    setEditedData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        personalInfo: {
          ...prev.profile.personalInfo,
          [key]: value
        }
      }
    }));
  };

  const handleSocialsChange = (key, value) => {
    setEditedData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        socials: {
          ...prev.profile.socials,
          [key]: value
        }
      }
    }));
  };

  // Array handlers (Add, Delete, Update)
  const addArrayItem = (key, defaultItem) => {
    setEditedData(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), { ...defaultItem, id: Date.now() }]
    }));
  };

  const deleteArrayItem = (key, id) => {
    setEditedData(prev => ({
      ...prev,
      [key]: prev[key].filter(item => item.id !== id)
    }));
  };

  const updateArrayItem = (key, id, field, value) => {
    setEditedData(prev => ({
      ...prev,
      [key]: prev[key].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  return (
    <div className="manage-panel-container container">
      {/* Top Header Controls */}
      <div className="manage-header">
        <div className="manage-title-box">
          <a href="#" className="btn btn-outline btn-back">
            <ArrowLeft size={16} className="btn-icon" /> Back to Site
          </a>
          <h2>Portfolio Manager</h2>
        </div>
        <div className="manage-actions">
          <button onClick={handleDownload} className="btn btn-outline" title="Download portfolio.json to manually save">
            <Download size={16} className="btn-icon" /> Download JSON
          </button>
          <button onClick={handleSave} className="btn btn-primary" disabled={isSaving}>
            <Save size={16} className="btn-icon" /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`manage-alert alert-${message.type}`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="manage-layout">
        {/* Left: Tabs Selector Sidebar */}
        <aside className="manage-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`manage-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </aside>

        {/* Right: Tab Contents */}
        <main className="manage-content">
          {/* TAB 1: Profile & Contact */}
          {activeTab === 'profile' && (
            <div className="manage-section-card">
              <h3>Personal Info</h3>
              <div className="form-grid">
                <div className="form-group-full">
                  <label>Name</label>
                  <input type="text" value={editedData.profile.name} onChange={e => handleProfileChange('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Primary Role</label>
                  <input type="text" value={editedData.profile.mainRole} onChange={e => handleProfileChange('mainRole', e.target.value)} />
                </div>
                <ImageUploadInput
                  label="Profile Pic"
                  value={editedData.profile.profilePic}
                  onChange={val => handleProfileChange('profilePic', val)}
                />
                <ImageUploadInput
                  label="About Pic"
                  value={editedData.profile.aboutPic}
                  onChange={val => handleProfileChange('aboutPic', val)}
                />
                <ImageUploadInput
                  label="CV PDF Document"
                  value={editedData.profile.cvUrl}
                  onChange={val => handleProfileChange('cvUrl', val)}
                  accept="application/pdf"
                />
                <div className="form-group-full">
                  <label>Biography Header Prefix</label>
                  <input type="text" value={editedData.profile.bioSummary} onChange={e => handleProfileChange('bioSummary', e.target.value)} />
                </div>
                <div className="form-group-full">
                  <label>Intro Headline</label>
                  <input type="text" value={editedData.profile.introHeadline} onChange={e => handleProfileChange('introHeadline', e.target.value)} />
                </div>
                <div className="form-group-full">
                  <label>About Description Paragraph</label>
                  <textarea rows="4" value={editedData.profile.aboutText} onChange={e => handleProfileChange('aboutText', e.target.value)}></textarea>
                </div>
              </div>

              <h3 style={{ marginTop: '2.5rem' }}>Contact Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={editedData.profile.personalInfo.Email || editedData.contact.email} onChange={e => {
                    handlePersonalInfoChange('Email', e.target.value);
                    setEditedData(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }));
                  }} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" value={editedData.profile.personalInfo.Phone || editedData.contact.phone} onChange={e => {
                    handlePersonalInfoChange('Phone', e.target.value);
                    setEditedData(prev => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }));
                  }} />
                </div>
                <div className="form-group">
                  <label>Location / Address</label>
                  <input type="text" value={editedData.profile.personalInfo.Address || editedData.contact.location} onChange={e => {
                    handlePersonalInfoChange('Address', e.target.value);
                    setEditedData(prev => ({ ...prev, contact: { ...prev.contact, location: e.target.value } }));
                  }} />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="text" value={editedData.profile.personalInfo["Date of birth"]} onChange={e => handlePersonalInfoChange('Date of birth', e.target.value)} />
                </div>
              </div>

              <h3 style={{ marginTop: '2.5rem' }}>Social Networks</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>LinkedIn URL</label>
                  <input type="text" value={editedData.profile.socials.linkedin} onChange={e => handleSocialsChange('linkedin', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>GitHub Profile URL</label>
                  <input type="text" value={editedData.profile.socials.github} onChange={e => handleSocialsChange('github', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Facebook URL</label>
                  <input type="text" value={editedData.profile.socials.facebook} onChange={e => handleSocialsChange('facebook', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Instagram URL</label>
                  <input type="text" value={editedData.profile.socials.instagram} onChange={e => handleSocialsChange('instagram', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Achievements */}
          {activeTab === 'achievements' && (
            <div className="manage-section-card">
              <div className="section-subtitle-action">
                <h3>Achievements List</h3>
                <button
                  onClick={() => addArrayItem('achievements', { title: 'New Achievement', category: 'General', issuer: 'Issuer', date: 'Date', description: 'Enter desc...', images: ['/assets/photography-1.jpg'] })}
                  className="btn btn-primary btn-card"
                >
                  <Plus size={14} className="btn-icon" /> Add New
                </button>
              </div>

              <div className="manage-items-list">
                {editedData.achievements.map(item => (
                  <div key={item.id} className="manage-item-row">
                    <div className="item-row-header">
                      <input
                        type="text"
                        className="inline-title-input"
                        value={item.title}
                        onChange={e => updateArrayItem('achievements', item.id, 'title', e.target.value)}
                        placeholder="Achievement Title"
                      />
                      <button onClick={() => deleteArrayItem('achievements', item.id)} className="btn-delete" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Category</label>
                        <input type="text" value={item.category} onChange={e => updateArrayItem('achievements', item.id, 'category', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Issuer</label>
                        <input type="text" value={item.issuer} onChange={e => updateArrayItem('achievements', item.id, 'issuer', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Date</label>
                        <input type="text" value={item.date} onChange={e => updateArrayItem('achievements', item.id, 'date', e.target.value)} />
                      </div>
                      <div className="form-group-full">
                        <label>Achievement Images</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {(item.images || []).map((img, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                              <div style={{ flex: 1 }}>
                                <ImageUploadInput
                                  label={`Image ${idx + 1}`}
                                  value={img}
                                  onChange={val => {
                                    const imagesCopy = [...item.images];
                                    imagesCopy[idx] = val;
                                    updateArrayItem('achievements', item.id, 'images', imagesCopy);
                                  }}
                                />
                              </div>
                              <button 
                                className="btn-delete" 
                                style={{ marginBottom: '0.25rem' }}
                                onClick={() => {
                                  const imagesCopy = item.images.filter((_, i) => i !== idx);
                                  updateArrayItem('achievements', item.id, 'images', imagesCopy);
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', alignSelf: 'flex-start', marginTop: '0.5rem' }}
                            onClick={() => {
                              const imagesCopy = [...(item.images || []), ''];
                              updateArrayItem('achievements', item.id, 'images', imagesCopy);
                            }}
                          >
                            <Plus size={14} style={{ marginRight: '0.25rem' }} /> Add Image
                          </button>
                        </div>
                      </div>
                      <div className="form-group-full">
                        <label>Short Description</label>
                        <input type="text" value={item.description} onChange={e => updateArrayItem('achievements', item.id, 'description', e.target.value)} />
                      </div>
                      <div className="form-group-full">
                        <label>Full Content Text</label>
                        <textarea rows="3" value={item.fullText || item.description} onChange={e => updateArrayItem('achievements', item.id, 'fullText', e.target.value)}></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Projects */}
          {activeTab === 'projects' && (
            <div className="manage-section-card">
              <div className="section-subtitle-action">
                <h3>Projects Gallery</h3>
                <button
                  onClick={() => addArrayItem('projects', { title: 'New Project', description: 'Brief description...', image: '/assets/photography-1.jpg', category: 'Web', link: '#', github: '#', tags: ['React', 'CSS'] })}
                  className="btn btn-primary btn-card"
                >
                  <Plus size={14} className="btn-icon" /> Add Project
                </button>
              </div>

              <div className="manage-items-list">
                {editedData.projects.map(item => (
                  <div key={item.id} className="manage-item-row">
                    <div className="item-row-header">
                      <input
                        type="text"
                        className="inline-title-input"
                        value={item.title}
                        onChange={e => updateArrayItem('projects', item.id, 'title', e.target.value)}
                        placeholder="Project Title"
                      />
                      <button onClick={() => deleteArrayItem('projects', item.id)} className="btn-delete" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Category</label>
                        <input type="text" value={item.category} onChange={e => updateArrayItem('projects', item.id, 'category', e.target.value)} />
                      </div>
                      <ImageUploadInput
                        label="Project Cover / Background Image"
                        value={item.image || item.backgroundImage}
                        onChange={val => {
                          updateArrayItem('projects', item.id, 'image', val);
                          if (item.backgroundImage !== undefined) {
                            updateArrayItem('projects', item.id, 'backgroundImage', val);
                          }
                        }}
                      />
                      <div className="form-group">
                        <label>Live Demo URL</label>
                        <input 
                          type="text" 
                          value={item.link !== undefined ? item.link : (item.demo || '')} 
                          onChange={e => {
                            updateArrayItem('projects', item.id, 'link', e.target.value);
                            if (item.demo !== undefined) {
                              updateArrayItem('projects', item.id, 'demo', e.target.value);
                            }
                          }} 
                        />
                      </div>
                      <div className="form-group">
                        <label>GitHub Link</label>
                        <input type="text" value={item.github} onChange={e => updateArrayItem('projects', item.id, 'github', e.target.value)} />
                      </div>
                      <div className="form-group-full">
                        <label>Tech Tags (Comma Separated)</label>
                        <input 
                          type="text" 
                          value={(item.tags !== undefined ? item.tags : (item.tech || [])).join(',')} 
                          onChange={e => {
                            const tagsArray = e.target.value.split(',');
                            updateArrayItem('projects', item.id, 'tags', tagsArray);
                            if (item.tech !== undefined) {
                              updateArrayItem('projects', item.id, 'tech', tagsArray);
                            }
                          }} 
                        />
                      </div>
                      <div className="form-group-full">
                        <label>Description</label>
                        <textarea rows="2" value={item.description} onChange={e => updateArrayItem('projects', item.id, 'description', e.target.value)}></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Services */}
          {activeTab === 'services' && (
            <div className="manage-section-card">
              <div className="section-subtitle-action">
                <h3>My Services</h3>
                <button
                  onClick={() => addArrayItem('services', { title: 'New Service', description: 'What you provide...' })}
                  className="btn btn-primary btn-card"
                >
                  <Plus size={14} className="btn-icon" /> Add Service
                </button>
              </div>

              <div className="manage-items-list">
                {editedData.services.map(item => (
                  <div key={item.id} className="manage-item-row">
                    <div className="item-row-header">
                      <input
                        type="text"
                        className="inline-title-input"
                        value={item.title}
                        onChange={e => updateArrayItem('services', item.id, 'title', e.target.value)}
                        placeholder="Service Title"
                      />
                      <button onClick={() => deleteArrayItem('services', item.id)} className="btn-delete" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="form-grid" style={{ marginTop: '0.75rem', width: '100%' }}>
                      <div className="form-group">
                        <label>Service Icon</label>
                        <select
                          value={item.icon || 'Settings'}
                          onChange={e => updateArrayItem('services', item.id, 'icon', e.target.value)}
                        >
                          <option value="Monitor">Monitor (Web Design)</option>
                          <option value="Code">Code (Software Engineering)</option>
                          <option value="Database">Database (Database Solutions)</option>
                          <option value="Smartphone">Smartphone (Mobile App)</option>
                          <option value="Layout">Layout (UI/UX)</option>
                          <option value="Cpu">Cpu (IT Specialist)</option>
                          <option value="Settings">Settings (General)</option>
                        </select>
                      </div>
                      <div className="form-group-full">
                        <label>Service Description</label>
                        <textarea rows="2" value={item.description} onChange={e => updateArrayItem('services', item.id, 'description', e.target.value)}></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Photography */}
          {activeTab === 'photography' && (
            <div className="manage-section-card">
              <div className="section-subtitle-action">
                <h3>Photography Gallery</h3>
                <button
                  onClick={() => addArrayItem('photography', { title: 'New Image', src: '/assets/photography-1.jpg', category: 'Landscape', desc: 'Description...', orientation: 'landscape' })}
                  className="btn btn-primary btn-card"
                >
                  <Plus size={14} className="btn-icon" /> Add Image
                </button>
              </div>

              <div className="manage-items-list">
                {editedData.photography?.map(item => (
                  <div key={item.id} className="manage-item-row">
                    <div className="item-row-header">
                      <input
                        type="text"
                        className="inline-title-input"
                        value={item.title}
                        onChange={e => updateArrayItem('photography', item.id, 'title', e.target.value)}
                        placeholder="Photo Title"
                      />
                      <button onClick={() => deleteArrayItem('photography', item.id)} className="btn-delete" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Category</label>
                        <input type="text" value={item.category} onChange={e => updateArrayItem('photography', item.id, 'category', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Orientation</label>
                        <select
                          value={item.orientation || 'landscape'}
                          onChange={e => updateArrayItem('photography', item.id, 'orientation', e.target.value)}
                        >
                          <option value="landscape">Landscape (Horizontal)</option>
                          <option value="portrait">Portrait (Vertical)</option>
                        </select>
                      </div>
                      <ImageUploadInput
                        label="Photo Source Image"
                        value={item.src}
                        onChange={val => updateArrayItem('photography', item.id, 'src', val)}
                      />
                      <div className="form-group-full">
                        <label>Description / Capture Context</label>
                        <textarea rows="2" value={item.desc} onChange={e => updateArrayItem('photography', item.id, 'desc', e.target.value)}></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Experience & Skills */}
          {activeTab === 'experience' && (
            <div className="manage-section-card">
              {/* Skills Subset */}
                  {/* Frontend Skills */}
                  <div className="section-subtitle-action" style={{ marginTop: '1.5rem' }}>
                    <h4>Frontend Skills</h4>
                    <button
                      onClick={() => {
                        const frontendCopy = [...(editedData.skills?.frontend || [])];
                        frontendCopy.push({ name: 'New Skill', level: 'Experienced' });
                        setEditedData(prev => ({
                          ...prev,
                          skills: { ...prev.skills, frontend: frontendCopy }
                        }));
                      }}
                      className="btn btn-primary btn-card"
                    >
                      <Plus size={14} className="btn-icon" /> Add Frontend Skill
                    </button>
                  </div>

                  <div className="skills-edit-table" style={{ marginTop: '1rem', marginBottom: '2.5rem' }}>
                    {(editedData.skills?.frontend || []).map((skill, index) => (
                      <div key={`fe-${index}`} className="skill-edit-row">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={e => {
                            const frontendCopy = [...editedData.skills.frontend];
                            frontendCopy[index].name = e.target.value;
                            setEditedData(prev => ({
                              ...prev,
                              skills: { ...prev.skills, frontend: frontendCopy }
                            }));
                          }}
                          placeholder="Skill Name"
                        />
                        <input
                          type="text"
                          value={skill.level}
                          onChange={e => {
                            const frontendCopy = [...editedData.skills.frontend];
                            frontendCopy[index].level = e.target.value;
                            setEditedData(prev => ({
                              ...prev,
                              skills: { ...prev.skills, frontend: frontendCopy }
                            }));
                          }}
                          placeholder="Level (e.g. Experienced)"
                        />
                        <div></div>
                        <button
                          onClick={() => {
                            const frontendCopy = editedData.skills.frontend.filter((_, idx) => idx !== index);
                            setEditedData(prev => ({
                              ...prev,
                              skills: { ...prev.skills, frontend: frontendCopy }
                            }));
                          }}
                          className="btn-delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Backend Skills */}
                  <div className="section-subtitle-action">
                    <h4>Backend & Tools Skills</h4>
                    <button
                      onClick={() => {
                        const backendCopy = [...(editedData.skills?.backend || [])];
                        backendCopy.push({ name: 'New Skill', level: 'Intermediate' });
                        setEditedData(prev => ({
                          ...prev,
                          skills: { ...prev.skills, backend: backendCopy }
                        }));
                      }}
                      className="btn btn-primary btn-card"
                    >
                      <Plus size={14} className="btn-icon" /> Add Backend Skill
                    </button>
                  </div>

                  <div className="skills-edit-table" style={{ marginTop: '1rem', marginBottom: '2.5rem' }}>
                    {(editedData.skills?.backend || []).map((skill, index) => (
                      <div key={`be-${index}`} className="skill-edit-row">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={e => {
                            const backendCopy = [...editedData.skills.backend];
                            backendCopy[index].name = e.target.value;
                            setEditedData(prev => ({
                              ...prev,
                              skills: { ...prev.skills, backend: backendCopy }
                            }));
                          }}
                          placeholder="Skill Name"
                        />
                        <input
                          type="text"
                          value={skill.level}
                          onChange={e => {
                            const backendCopy = [...editedData.skills.backend];
                            backendCopy[index].level = e.target.value;
                            setEditedData(prev => ({
                              ...prev,
                              skills: { ...prev.skills, backend: backendCopy }
                            }));
                          }}
                          placeholder="Level (e.g. Intermediate)"
                        />
                        <div></div>
                        <button
                          onClick={() => {
                            const backendCopy = editedData.skills.backend.filter((_, idx) => idx !== index);
                            setEditedData(prev => ({
                              ...prev,
                              skills: { ...prev.skills, backend: backendCopy }
                            }));
                          }}
                          className="btn-delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

              {/* Experience Subset */}
              <div className="section-subtitle-action" style={{ marginTop: '3.5rem' }}>
                <h3>Professional Experience</h3>
                <button
                  onClick={() => addArrayItem('experienceCards', { role: 'Job Role', company: 'Company', duration: 'Present', description: 'Desc...', tags: ['React'] })}
                  className="btn btn-primary btn-card"
                >
                  <Plus size={14} className="btn-icon" /> Add Experience
                </button>
              </div>

              <div className="manage-items-list">
                {editedData.experienceCards?.map(item => (
                  <div key={item.id} className="manage-item-row">
                    <div className="item-row-header">
                      <input
                        type="text"
                        className="inline-title-input"
                        value={item.role}
                        onChange={e => updateArrayItem('experienceCards', item.id, 'role', e.target.value)}
                        placeholder="Job Title"
                      />
                      <button onClick={() => deleteArrayItem('experienceCards', item.id)} className="btn-delete" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Company</label>
                        <input type="text" value={item.company} onChange={e => updateArrayItem('experienceCards', item.id, 'company', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Duration / Period</label>
                        <input type="text" value={item.duration} onChange={e => updateArrayItem('experienceCards', item.id, 'duration', e.target.value)} />
                      </div>
                      <div className="form-group-full">
                        <label>Skills tags (Comma Separated)</label>
                        <input type="text" value={item.tags?.join(', ')} onChange={e => updateArrayItem('experienceCards', item.id, 'tags', e.target.value.split(',').map(x => x.trim()))} />
                      </div>
                      <div className="form-group-full">
                        <label>Key Responsibilities</label>
                        <textarea rows="2" value={item.description} onChange={e => updateArrayItem('experienceCards', item.id, 'description', e.target.value)}></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* TAB 7: Education */}
          {activeTab === 'education' && (
            <div className="manage-section-card">
              <div className="section-subtitle-action">
                <h3>Education Timeline</h3>
                <button
                  onClick={() => addArrayItem('education', { degree: 'Degree Name', institution: 'University / School Name', period: '2020 - 2024', location: 'City, Country', description: 'Brief description of studies...' })}
                  className="btn btn-primary btn-card"
                >
                  <Plus size={14} className="btn-icon" /> Add Education
                </button>
              </div>

              <div className="manage-items-list">
                {(editedData.education || []).map(item => (
                  <div key={item.id} className="manage-item-row">
                    <div className="item-row-header">
                      <input
                        type="text"
                        className="inline-title-input"
                        value={item.degree}
                        onChange={e => updateArrayItem('education', item.id, 'degree', e.target.value)}
                        placeholder="Degree / Qualification"
                      />
                      <button onClick={() => deleteArrayItem('education', item.id)} className="btn-delete" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Institution</label>
                        <input type="text" value={item.institution} onChange={e => updateArrayItem('education', item.id, 'institution', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Period</label>
                        <input type="text" value={item.period} onChange={e => updateArrayItem('education', item.id, 'period', e.target.value)} />
                      </div>
                      <div className="form-group-full">
                        <label>Location</label>
                        <input type="text" value={item.location} onChange={e => updateArrayItem('education', item.id, 'location', e.target.value)} />
                      </div>
                      <div className="form-group-full">
                        <label>Description</label>
                        <textarea rows="2" value={item.description} onChange={e => updateArrayItem('education', item.id, 'description', e.target.value)}></textarea>
                      </div>
                    </div>
                  </div>
                 ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
