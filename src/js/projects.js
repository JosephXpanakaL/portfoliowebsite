/* Structured & Modern Project Showcase Logic */

export const PROJECTS = [
  {
    id: 'rigmaster-ai',
    idx: '01',
    title: 'RigMasterAI',
    subtitle: 'Intelligent System Configurator',
    category: 'personal',
    categoryName: 'Personal AI',
    status: 'Live App',
    statusClass: 'status-live',
    summary: 'AI-driven web application utilizing structured prompt pipelines to analyze computer hardware compatibility and system configurations.',
    problemSolved: 'Eliminates confusion in PC hardware matching by using AI prompt pipelines for real-time compatibility and power analysis.',
    tags: ['Python', 'AI APIs', 'Prompt Eng', 'JavaScript', 'Vercel'],
    description: `RigMasterAI is an exploratory project integrating modern artificial intelligence into software applications.

Key Engineering Highlights:
• Interactive web frontend connected to intelligent API endpoints with custom error handling.
• Prompt engineering pipelines and structured JSON response parsing for dynamic configuration advice.
• Deployed globally on Vercel cloud infrastructure.`,
    githubUrl: 'https://github.com/blessen5',
    demoUrl: 'https://rigmaster-ai.vercel.app/'
  },
  {
    id: 'lars',
    idx: '02',
    title: 'Lab Activity Reporting System (LARS)',
    subtitle: 'Academic Lab Management Portal',
    category: 'academic',
    categoryName: 'Academic',
    status: 'Completed',
    statusClass: 'status-completed',
    summary: 'Web-based software system streamlining lab management, student activity submissions, attendance tracking, and reporting logs.',
    problemSolved: 'Replaces paper logs with a centralized portal for students and administrators to track lab sessions and submissions in real time.',
    tags: ['PHP', 'MySQL', 'JavaScript', 'HTML5 / CSS3', 'RBAC'],
    description: `The Lab Activity Reporting System (LARS) is a full-featured web-based academic project engineered to manage laboratory sessions and student attendance.

Key Engineering Highlights:
• Relational database schema tracking lab sessions, student profiles, and submission timestamps.
• Role-based access control (RBAC) separating student submissions and administrator review workflows.
• Clean responsive interface crafted with HTML5, CSS3, JavaScript, and PHP.`,
    githubUrl: 'https://github.com/blessen5',
    demoUrl: ''
  },
  {
    id: 'data-analytics-suite',
    idx: '03',
    title: 'Data Analytics & SQL Pipeline',
    subtitle: 'ETL & Business Intelligence',
    category: 'personal',
    categoryName: 'Data Analytics',
    status: 'Active Repo',
    statusClass: 'status-active',
    summary: 'Python and SQL pipelines for automated data cleansing, multi-table aggregations, ETL transformations, and analytical reporting.',
    problemSolved: 'Normalizes messy transactional data and generates clean analytical metrics using optimized SQL queries and Pandas workflows.',
    tags: ['Python', 'SQL', 'Pandas', 'Data Analytics', 'ETL'],
    description: `A collection of data processing scripts focused on practical data engineering workflows.

Key Engineering Highlights:
• Automated data cleaning pipelines with Pandas and NumPy for missing value imputation.
• Multi-table relational queries, indexing, and window function aggregations in SQL.
• Reproducible Jupyter analysis workflows.`,
    githubUrl: 'https://github.com/blessen5',
    demoUrl: ''
  },
  {
    id: 'cloud-devops-lab',
    idx: '04',
    title: 'Cloud & Containerized Lab',
    subtitle: 'Docker & Virtualization Setup',
    category: 'personal',
    categoryName: 'Cloud & DevOps',
    status: 'Active Lab',
    statusClass: 'status-active',
    summary: 'Standardized development environments and deployment templates leveraging Docker containers, Linux VMs, and Bash automation scripts.',
    problemSolved: 'Eliminates environment inconsistency by packaging multi-service application stacks into reproducible Docker containers.',
    tags: ['Docker', 'Linux', 'Bash Scripts', 'Cloud', 'DevOps'],
    description: `Practical cloud and DevOps environment configurations designed for consistent application development and deployment testing.

Key Engineering Highlights:
• Multi-container Dockerfiles and docker-compose configurations with volume persistence.
• Bash automation scripts for Linux system provisioning and health checks.
• Hands-on container orchestration workflows.`,
    githubUrl: 'https://github.com/blessen5',
    demoUrl: ''
  }
];

export function initProjects() {
  const container = document.getElementById('projects-container');
  const modalBackdrop = document.getElementById('project-modal-backdrop');
  const modalContent = document.getElementById('project-modal-body');
  const modalClose = document.getElementById('modal-close-btn');

  if (!container) return;

  function renderProjects() {
    container.innerHTML = '';

    PROJECTS.forEach((project, idx) => {
      const item = document.createElement('div');
      item.className = `project-card reveal-on-scroll delay-${(idx % 4 + 1) * 100}`;
      
      const isLive = project.status.toLowerCase().includes('live') || project.status.toLowerCase().includes('active');

      item.innerHTML = `
        <div class="card-shimmer-top" aria-hidden="true"></div>

        <div class="project-card-header">
          <div class="project-pill-meta">
            <span class="project-idx-badge">${project.idx}</span>
            <span class="project-cat-name">${project.categoryName}</span>
          </div>

          <div class="project-status-pill ${isLive ? 'status-pill-live' : 'status-pill-done'}">
            <span class="status-indicator-dot"></span>
            <span>${project.status}</span>
          </div>
        </div>

        <div class="project-card-body">
          <h3 class="project-card-title">${project.title}</h3>
          <div class="project-card-subtitle">${project.subtitle}</div>
          
          <p class="project-card-summary">${project.summary}</p>
          
          <div class="project-card-badges">
            ${project.tags.map(t => `<span class="badge-tag">${t}</span>`).join('')}
          </div>
        </div>

        <div class="project-card-footer">
          <button class="btn btn-secondary view-details-btn project-btn-details" data-id="${project.id}">
            <span>Details</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="btn-arrow"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          <div class="project-quick-links">
            ${project.githubUrl ? `
              <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-icon-circle" title="View Source on GitHub" aria-label="View ${project.title} on GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
            ` : ''}
            ${project.demoUrl ? `
              <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary project-btn-live" title="Open Live Web Application" aria-label="Open Live Application for ${project.title}">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                <span>Live</span>
              </a>
            ` : ''}
          </div>
        </div>
      `;

      item.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
          openModal(project);
        }
      });

      container.appendChild(item);
    });

    if (window.observeReveals) window.observeReveals();
  }

  let previousActiveElement = null;

  function openModal(project) {
    if (!modalContent || !modalBackdrop) return;
    previousActiveElement = document.activeElement;
    modalContent.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
        <span style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--text-muted);">${project.categoryName}</span>
        <span style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--text-main); background: rgba(255, 255, 255, 0.08); padding: 0.2rem 0.55rem; border-radius: var(--radius-full); border: 1px solid rgba(255, 255, 255, 0.12);">
          ${project.status}
        </span>
      </div>

      <h2 id="modal-project-title" style="font-size: 1.65rem; font-weight: 800; margin-bottom: 0.25rem; color: var(--text-main);">
        ${project.title}
      </h2>
      <div style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-muted); font-weight: 600; margin-bottom: 1.25rem;">
        ${project.subtitle}
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1.25rem;">
        ${project.tags.map(t => `<span class="badge-tag" style="font-size: 0.75rem; padding: 0.2rem 0.6rem;">${t}</span>`).join('')}
      </div>

      <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-left: 3px solid rgba(255, 255, 255, 0.3); padding: 0.85rem 1.15rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem;">
        <div style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.2rem;">PROBLEM SOLVED:</div>
        <div style="color: var(--text-body); font-size: 0.88rem; line-height: 1.5;">${project.problemSolved}</div>
      </div>

      <div style="color: var(--text-body); font-size: 0.92rem; line-height: 1.65; white-space: pre-line; margin-bottom: 1.75rem; background: rgba(255, 255, 255, 0.02); padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        ${project.description}
      </div>

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        ${project.githubUrl ? `
          <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            <span>View on GitHub</span>
          </a>
        ` : ''}
        ${project.demoUrl ? `
          <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            <span>Open Live App</span>
          </a>
        ` : ''}
      </div>
    `;
    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    modalClose?.focus();
  }

  function closeModal() {
    if (!modalBackdrop?.classList.contains('active')) return;
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  }

  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('active')) {
      closeModal();
    }
  });

  renderProjects();
}
