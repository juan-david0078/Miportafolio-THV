// --- Supabase Config ---
// Pega aquí los valores que te da Supabase en la sección Configuración -> API
const SUPABASE_URL = 'https://rrybzaczobcjrqzsfhwv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-TzkuqnjAVO1HB0MYhpAnw_4C2X4Fhn';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Variables globales para la data
let cvData = [];
let projectUnits = [];

// Función para cargar datos desde la base de datos
async function loadData() {
    try {
        // Cargar hojas de vida
        const { data: cvs, error: cvsError } = await supabaseClient.from('cvs').select('*').order('id', { ascending: true });
        if (cvsError) throw cvsError;
        cvData = cvs || [];

        // Cargar unidades del proyecto
        const { data: projects, error: projError } = await supabaseClient.from('projects').select('*').order('id', { ascending: true });
        if (projError) throw projError;
        projectUnits = projects || [];

    } catch (error) {
        console.error("Error al cargar datos de Supabase:", error);
    }
}


// --- Views HTML Generators ---

const views = {
    inicio: () => `
        <div class="hero">
            <h2>Bienvenidos</h2>
            <p>Este proyecto es un trabajo entregable académico para la Universidad Católica Luis Amigó, enfocado en presentar nuestros perfiles profesionales y la gestión del proyecto.</p>
        </div>
    `,

    cvs: () => `
        <div class="cv-container">
            ${cvData.map(cv => `
                <div class="cv-card">
                    <img src="${cv.avatar}" alt="${cv.name}" class="cv-avatar">
                    <h3>${cv.name}</h3>
                    <div class="role">${cv.role}</div>
                    <div class="cv-info">
                        <p><strong>Email:</strong> ${cv.email}</p>
                        <p><strong>Teléfono:</strong> ${cv.phone}</p>
                        <p><strong>Estudios:</strong> ${cv.studies}</p>
                        ${cv.linkedin ? `<p><strong>LinkedIn:</strong> <a href="${cv.linkedin}" target="_blank" style="color: var(--primary); text-decoration: none;">Ver Perfil</a></p>` : ''}
                    </div>
                    <p class="description">${cv.description}</p>
                    <div class="skills-list">
                        ${(cv.skills || []).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `,

    proyecto: () => `
        <div class="project-units">
            ${projectUnits.map(unit => `
                <div class="unit-card">
                    <div class="unit-number">0${unit.id}</div>
                    <h4>${unit.title}</h4>
                    <ul style="list-style-type: none; padding-left: 0; color: var(--text-muted); line-height: 1.6; font-size: 0.95rem; flex-grow: 1; z-index: 1;">
                        ${(unit.topics || []).map(topic => `<li style="margin-bottom: 0.5rem;">${topic}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
    `
};


// --- Router Logic ---

document.addEventListener("DOMContentLoaded", async () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const contentArea = document.getElementById('content-area');
    const pageTitle = document.getElementById('page-title'); // Se puede ocultar o cambiar ya que es una sola página

    if (pageTitle) pageTitle.textContent = "Portafolio y Proyectos";

    // Estado de carga inicial
    contentArea.innerHTML = '<div style="text-align:center; padding: 3rem; color: var(--text-muted);">Conectando con Supabase... 🚀</div>';

    // Cargar datos asíncronamente
    await loadData();

    // Renderizar TODAS las secciones a la vez (Formato One-Page)
    contentArea.innerHTML = `
        <section id="inicio" style="min-height: 70vh; display: flex; align-items: center; justify-content: center;">
            ${views.inicio()}
        </section>
        
        <section id="cvs" style="padding: 4rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
            <h2 style="font-family: var(--font-heading); font-size: 2.5rem; text-align: center; margin-bottom: 3rem; background: linear-gradient(to right, #60a5fa, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Nuestro Equipo</h2>
            ${views.cvs()}
        </section>
        
        <section id="proyecto" style="padding: 4rem 0; border-top: 1px solid rgba(255,255,255,0.05);">
            <h2 style="font-family: var(--font-heading); font-size: 2.5rem; text-align: center; margin-bottom: 3rem; background: linear-gradient(to right, #60a5fa, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Temario de Proyecto</h2>
            ${views.proyecto()}
        </section>
    `;

    // Animar la opacidad
    contentArea.style.opacity = 0;
    setTimeout(() => { contentArea.style.opacity = 1; contentArea.style.transition = 'opacity 0.5s ease'; }, 50);

    // Lógica de Scroll Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Cambiar clase activa
            navLinks.forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');

            // Hacer Scroll hacia la sección seleccionada
            const route = e.currentTarget.getAttribute('data-route');
            const targetSection = document.getElementById(route);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
