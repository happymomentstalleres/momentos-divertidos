const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Config = require('../models/Config');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Crear usuario admin si no existe
    const existing = await User.findOne({ email: 'admin@momentos.com' });
    if (!existing) {
      await User.create({
        name: 'Administrador',
        email: 'admin@momentos.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Usuario admin creado: admin@momentos.com / admin123');
    } else {
      console.log('ℹ️  Usuario admin ya existe');
    }

    // Crear configuración inicial si no existe
    const config = await Config.findOne();
    if (!config) {
      await Config.create({
        businessName: 'Momentos Divertidos',
        whatsappNumber: '975335798',
        contactEmail: 'contacto@momentosdivertidos.com',
        deliveryCost: 10,
        freeDeliveryZones: ['Plaza de Armas', 'Parque Alameda de Moquegua'],
        socialMedia: {
          instagram: 'https://instagram.com/momentosdivertidos',
          facebook: '',
          tiktok: '',
          whatsapp: 'https://wa.me/975335798',
        },
      });
      console.log('✅ Configuración inicial creada');
    } else {
      console.log('ℹ️  Configuración ya existe');
    }

    console.log('\n🎂 Seed completado exitosamente!');
    console.log('📧 Admin: admin@momentos.com');
    console.log('🔑 Password: admin123');
    console.log('\n⚠️  IMPORTANTE: Cambia la contraseña del admin después de iniciar sesión por primera vez.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error.message);
    process.exit(1);
  }
};

seed();
