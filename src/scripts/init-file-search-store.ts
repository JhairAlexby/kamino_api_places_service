import * as dotenv from 'dotenv';
dotenv.config();

async function createFileSearchStore() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no está configurada en .env');
  }

  console.log('🚀 Creando File Search Store...\n');

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/fileSearchStores',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
        },
        body: JSON.stringify({
          displayName: 'kamino-places-narratives',
        }),
      },
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Error al crear el store:', data);
      throw new Error(`Error: ${JSON.stringify(data)}`);
    }

    console.log('✅ File Search Store creado exitosamente!\n');
    console.log('📋 Información del Store:');
    console.log('   Name:', data.name);
    console.log('   Display Name:', data.displayName);
    console.log('   Create Time:', data.createTime);
    console.log('\n📝 IMPORTANTE: Agrega esta línea a tu archivo .env:');
    console.log(`\nFILE_SEARCH_STORE_ID=${data.name}\n`);
    
    return data.name;
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createFileSearchStore();
