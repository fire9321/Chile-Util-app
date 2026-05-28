// CONTROL DE PESTAÑAS (TABS)
function cambiarTab(tab) {
    const secBonos = document.getElementById('seccion-bonos');
    const secFiniquito = document.getElementById('seccion-finiquito');
    const btnBonos = document.getElementById('btn-tab-bonos');
    const btnFiniquito = document.getElementById('btn-tab-finiquito');

    if (tab === 'bonos') {
        secBonos.classList.remove('hidden');
        secFiniquito.classList.add('hidden');
        btnBonos.className = "border-b-4 border-white pb-1 transition-all";
        btnFiniquito.className = "border-b-4 border-transparent pb-1 opacity-70 hover:opacity-100 transition-all";
    } else {
        secBonos.classList.add('hidden');
        secFiniquito.classList.remove('hidden');
        btnBonos.className = "border-b-4 border-transparent pb-1 opacity-70 hover:opacity-100 transition-all";
        btnFiniquito.className = "border-b-4 border-white pb-1 transition-all";
    }
}

// MOTOR LOGICO DEL BUSCADOR DE BONOS CHILE
function buscarBonos(event) {
    event.preventDefault();
    
    const rsh = parseInt(document.getElementById('bono-rsh').value);
    const edad = parseInt(document.getElementById('bono-edad').value);
    const genero = document.getElementById('bono-genero').value;
    const laboral = document.getElementById('bono-laboral').value;
    const tieneHijos = document.getElementById('bono-hijos').checked;

    const listaBonos = document.getElementById('lista-bonos');
    listaBonos.innerHTML = ''; // Limpiar resultados previos
    
    // Base de datos integrada (Costo $0 de servidor)
    const ofertasBonos = [
        {
            nombre: "Bono al Trabajo de la Mujer (BTM)",
            requisito: genero === 'F' && edad >= 25 && edad <= 59 && rsh <= 40 && laboral === 'dependiente',
            descripcion: "Subsidio mensual para mujeres trabajadoras dependientes o independientes del tramo 40% del RSH.",
            link: "https://www.sence.cl"
        },
        {
            nombre: "Subsidio al Empleo Joven (SEJ)",
            requisito: edad >= 18 && edad <= 24 && rsh <= 40 && (laboral === 'dependiente' || laboral === 'independiente'),
            descripcion: "Apoyo monetario del Sence para jóvenes trabajadores y sus empleadores.",
            link: "https://www.sence.cl"
        },
        {
            nombre: "Subsidio Familiar (SUF)",
            requisito: tieneHijos && rsh <= 60,
            descripcion: "Destinado a personas que pertenezcan al 60% más vulnerable y que no puedan proveer la mantención de sus cargas.",
            link: "https://www.chileatiende.gob.cl"
        },
        {
            nombre: "Bono por Hijo",
            requisito: genero === 'F' && edad >= 65 && tieneHijos,
            descripcion: "Aporte que incrementa el monto de la pensión de la mujer por cada hijo nacido vivo o adoptado.",
            link: "https://www.chileatiende.gob.cl"
        },
        {
            nombre: "Subsidio de Cesantía / Fondo de Cesantía Solidario",
            requisito: laboral === 'cesante',
            descripcion: "Si cuentas con cotizaciones en la AFC o cumples causales específicas, puedes retirar tu fondo o acceder al solidario.",
            link: "https://www.afc.cl"
        }
    ];

    // Filtrar los que aplican
    const filtrados = ofertasBonos.filter(b => b.requisito);

    if (filtrados.length === 0) {
        listaBonos.innerHTML = `<p class="text-sm text-gray-500 bg-gray-50 p-3 rounded">No detectamos bonos masivos automáticos con este perfil específico, pero te recomendamos revisar directamente en ChileAtiende según tu cartola de Hogar.</p>`;
    } else {
        filtrados.forEach(bono => {
            const div = document.createElement('div');
            div.className = "p-3 bg-blue-50 border border-blue-100 rounded-lg space-y-1";
            div.innerHTML = `
                <h4 class="font-bold text-blue-900 text-sm">${bono.nombre}</h4>
                <p class="text-xs text-gray-600">${bono.descripcion}</p>
                <a href="${bono.link}" target="_blank" class="inline-block text-xs font-bold text-blue-600 underline pt-1">Ver cómo postular →</a>
            `;
            listaBonos.appendChild(div);
        });
    }

    document.getElementById('resultados-bonos').classList.remove('hidden');
}

// LÓGICA MATEMÁTICA: CALCULADORA DE FINIQUITO
function calcularFiniquito(event) {
    event.preventDefault();

    const sueldoBase = parseFloat(document.getElementById('fin-sueldo').value);
    const mesesTrabajados = parseInt(document.getElementById('fin-meses').value);
    const diasVacaciones = parseFloat(document.getElementById('fin-vacaciones').value);
    const causal = document.getElementById('fin-causal').value;

    let aniosServicio = Math.floor(mesesTrabajados / 12);
    const mesesRestantes = mesesTrabajados % 12;
    
    // En Chile, si trabajaste más de la mitad del año (más de 6 meses), se salta al siguiente año para indemnización
    if (mesesRestantes > 6) {
        aniosServicio += 1;
    }

    let pagoAniosServicio = 0;
    let pagoMesAviso = 0;

    if (causal === "161") {
        pagoAniosServicio = sueldoBase * aniosServicio;
        pagoMesAviso = sueldoBase; // Simplificado: 1 sueldo si no avisan con 30 días de anticipación
    }

    // Pago de Vacaciones proporcionales aproximado (Valor día ordinario)
    // Con la jornada de 42 horas en 2026, el valor diario se calcula dividiendo el sueldo base mensual por 30.
    const valorDiaTrabajo = sueldoBase / 30;
    const pagoVacaciones = diasVacaciones * valorDiaTrabajo;

    const totalFiniquito = pagoAniosServicio + pagoMesAviso + pagoVacaciones;

    // Renderizar resultados en la vista
    document.getElementById('res-anios').innerText = `${aniosServicio} año(s)`;
    document.getElementById('res-indem-anios').innerText = `$${Math.round(pagoAniosServicio).toLocaleString('es-CL')}`;
    document.getElementById('res-aviso').innerText = `$${Math.round(pagoMesAviso).toLocaleString('es-CL')}`;
    document.getElementById('res-vac-pago').innerText = `$${Math.round(pagoVacaciones).toLocaleString('es-CL')}`;
    document.getElementById('res-total').innerText = `$${Math.round(totalFiniquito).toLocaleString('es-CL')}`;

    document.getElementById('resultados-finiquito').classList.remove('hidden');
}