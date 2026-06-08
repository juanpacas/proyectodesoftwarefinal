const express = require('express');
const PocketBase = require('pocketbase/cjs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const pb = new PocketBase('http://148.116.64.112:8090');


app.post('/api/registro', async (req, res) => {
    const { name, email, password, telefono, direccion, ciudad, rol, especialidad } = req.body;
    try {
        const nuevoUsuario = {
            username: email.split('@')[0] + Math.floor(Math.random() * 1000),
            email: email,
            password: password,
            passwordConfirm: password,
            name: name,
            telefono: telefono || '',
            direccion: direccion || '',
            ciudad: ciudad || '',
            rol: rol || '', 
            especialidad: rol === 'proveedor' ? especialidad : ''
        };

        const record = await pb.collection('usuarios').create(nuevoUsuario);
        res.json({ success: true, user: record });
    } catch (error) {
        console.error("Error en registro:", error.message);
        res.status(500).json({ success: false, message: 'Error al registrar en PocketBase' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const authData = await pb.collection('usuarios').authWithPassword(email, password);
        
        res.json({ success: true, user: authData.record });
    } catch (error) {
        console.error("Error en login:", error.message);
        res.status(401).json({ success: false, message: 'Falla en la autenticación' });
    }
});


app.get('/api/proveedores/:servicio', async (req, res) => {
    const { servicio } = req.params; 
    try {
        
        const records = await pb.collection('usuarios').getFullList({
            filter: `rol = "proveedor" && especialidad = "${servicio}"`
        });
        res.json(records);
    } catch (error) {
        console.error("Error filtrando proveedores:", error.message);
        res.status(500).json({ error: 'Error al obtener proveedores' });
    }
});


app.get('/api/servicios/:proveedor_id', async (req, res) => {
  try {
    const { proveedor_id } = req.params;
    
    const servicios = await pb.collection('servicios').getList(1, 50, {
      filter: `proveedor_id = "${proveedor_id}"`,
    });
    res.json({ success: true, items: servicios.items });
  } catch (error) {
    res.status(500).json({ success: false, message: "No se pudieron cargar los servicios" });
  }
});



app.get('/api/citas-pendientes/:proveedor_id', async (req, res) => {
  try {
    const { proveedor_id } = req.params;
    const citas = await pb.collection('citas').getFullList({
      filter: `proveedor_id = "${proveedor_id}" && estado = "pendiente"`
    });
    res.json({ success: true, items: citas });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al cargar citas" });
  }
});

app.post('/api/actualizar-cita', async (req, res) => {
  try {
    const { cita_id, nuevoEstado } = req.body;
    await pb.collection('citas').update(cita_id, { estado: nuevoEstado });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.post('/api/citas', async (req, res) => {
    
    const { clienteId, proveedorId, servicio, nombreCliente, precio } = req.body;
    try {
        const nuevaCita = {
            cliente_id: clienteId,
            proveedor_id: proveedorId,
            servicio: servicio,
            precio: precio,
            nombre_cliente: nombreCliente,
            estado: 'pendiente' 
        };
        const record = await pb.collection('citas').create(nuevaCita);
        res.json({ success: true, cita: record });
    } catch (error) {
        console.error("Error al crear cita:", error.message);
        res.status(500).json({ success: false, message: 'Error al solicitar la cita' });
    }
});

app.get('/api/proveedor/citas/:proveedorId', async (req, res) => {
    const { proveedorId } = req.params;
    try {
        
        const records = await pb.collection('citas').getFullList({
            filter: `proveedor_id = "${proveedorId}"`
        });
        res.json(records);
    } catch (error) {
        console.error("Error obteniendo citas del proveedor:", error.message);
        res.status(500).json({ error: 'Error al cargar solicitudes' });
    }
});

app.post('/api/citas/estado', async (req, res) => {
    const { citaId, nuevoEstado } = req.body;
    try {
        const record = await pb.collection('citas').update(citaId, { estado: nuevoEstado });
        res.json({ success: true, cita: record });
    } catch (error) {
        console.error("Error actualizando cita:", error.message);
        res.status(500).json({ success: false, message: 'Error al cambiar estado de la cita' });
    }
});

app.post('/api/guardar-servicio', async (req, res) => {
  try {
    const { nombre, precio, duracion, proveedor_id } = req.body;

    const record = await pb.collection('servicios').create({
      nombre_del_servicio: nombre,
      Precio: precio,
      Duracion: duracion,
      proveedor_id: proveedor_id
    });

    res.json({ success: true, record });
  } catch (error) {
    console.error("Error detallado:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend de listo en el puerto ${PORT}`);
});