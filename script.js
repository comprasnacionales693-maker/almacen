/* =====================================================================
   script.js — EJEMPLO de llamadas al backend (API real, no localStorage)
   -----------------------------------------------------------------
   Estas rutas ("/api/login", "/api/productos") son EJEMPLOS: no
   existen todavía. Habría que crearlas en el proyecto ASP.NET Core
   usando las clases login.cs y productos.cs de la carpeta Backend/,
   expuestas como endpoints web.

   CONVENCIÓN DE NOMBRES:
     n1_ = variables PRINCIPALES (usuario, clave, resultado del login)
     n2_ = variables SECUNDARIAS (almacén asignado, permisos)
     n3_ = variables TERCIARIAS (mensajes de error)
   ===================================================================== */

async function n1_iniciarSesion() {
    const n1_usuario = document.getElementById('n1_inputUsuario').value.trim();
    const n1_clave = document.getElementById('n1_inputClave').value;

    try {
        const n1_respuesta = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ n1_usuario, n1_clave })
        });
        const n1_resultado = await n1_respuesta.json();

        if (!n1_resultado.n1_esValido) {
            document.getElementById('n3_mensajeError').innerText = n1_resultado.n3_mensajeError || 'Usuario o contraseña incorrectos';
            return;
        }

        // Se guarda el almacén y los permisos que devolvió el backend (ya no se eligen a mano)
        localStorage.setItem('n2_almacenAsignado', n1_resultado.n2_almacenAsignado);
        localStorage.setItem('n2_permisos', JSON.stringify(n1_resultado.n2_permisos));

        document.getElementById('n1_pantallaLogin').style.display = 'none';
        document.getElementById('n1_pantallaStock').style.display = 'block';
        n1_cargarStock(n1_resultado.n2_almacenAsignado);

    } catch (n3_error) {
        document.getElementById('n3_mensajeError').innerText = 'No se pudo conectar con el servidor.';
    }
}

async function n1_cargarStock(n2_almacenId) {
    try {
        const n1_respuesta = await fetch(`/api/productos?almacen=${n2_almacenId}`);
        const n1_productos = await n1_respuesta.json();

        const n1_tbody = document.getElementById('n1_tablaStockBody');
        n1_tbody.innerHTML = n1_productos.map(p => `
            <tr>
                <td>${p.n1_codigoOsis}</td>
                <td>${p.n1_nombreProducto}</td>
                <td>${p.n2_unidadMedida}</td>
                <td>${p.n2_stockActual}</td>
            </tr>
        `).join('');
    } catch (n3_error) {
        console.error('No se pudo cargar el stock:', n3_error);
    }
}
