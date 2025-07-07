const API_BASE = 'http://localhost:7007/api/keninduty';

async function generateTestLogs() {
  console.log('🚀 Gerando logs de teste...\n');

  try {
    // 1. Criar um alerta
    console.log('1. Criando alerta de teste...');
    const alertResponse = await fetch(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Teste de Logs',
        description: 'Alerta para testar o sistema de logs',
        severity: 'high',
        provider: 'datadog',
        teamId: 'team-1751852470761',
        providerAlertId: 'test-logs-123'
      })
    });
    
    const alertData = await alertResponse.json();
    console.log('✅ Alerta criado:', alertData.data?.id || 'Erro');
    
    if (!alertData.success) {
      console.error('❌ Erro ao criar alerta:', alertData.error);
      return;
    }

    const alertId = alertData.data.id;
    const callId = `call-test-${Date.now()}`;

    // 2. Inicializar chamada
    console.log('2. Inicializando chamada...');
    const callResponse = await fetch(`${API_BASE}/calls/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callId,
        alertId,
        teamId: 'team-1751852470761'
      })
    });
    
    const callData = await callResponse.json();
    console.log('✅ Chamada inicializada:', callData.success ? 'Sucesso' : 'Erro');

    // 3. Fazer callbacks
    console.log('3. Fazendo callbacks...');
    
    // Callback 1: No answer
    await fetch(`${API_BASE}/calls/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callId,
        status: 'no-answer',
        timestamp: new Date().toISOString(),
        notes: 'Primeira tentativa - sem resposta',
        duration: 30000
      })
    });
    console.log('✅ Callback 1 enviado (no-answer)');

    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Callback 2: Failed
    await fetch(`${API_BASE}/calls/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callId,
        status: 'failed',
        timestamp: new Date().toISOString(),
        notes: 'Segunda tentativa - falhou',
        duration: 15000
      })
    });
    console.log('✅ Callback 2 enviado (failed)');

    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Callback 3: Answered
    await fetch(`${API_BASE}/calls/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callId,
        status: 'answered',
        timestamp: new Date().toISOString(),
        notes: 'Terceira tentativa - atendida!',
        duration: 45000
      })
    });
    console.log('✅ Callback 3 enviado (answered)');

    // 4. Verificar logs
    console.log('\n4. Verificando logs...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const logsResponse = await fetch(`${API_BASE}/logs/realtime`);
    const logsData = await logsResponse.json();
    
    console.log('📊 Logs encontrados:', logsData.data?.logs?.length || 0);
    
    if (logsData.data?.logs?.length > 0) {
      console.log('\n📝 Últimos logs:');
      logsData.data.logs.slice(-5).forEach((log, index) => {
        console.log(`${index + 1}. [${log.level.toUpperCase()}] ${log.message}`);
      });
    } else {
      console.log('❌ Nenhum log encontrado');
    }

    console.log('\n🎉 Teste concluído! Verifique a aba de logs no frontend.');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar o teste
generateTestLogs(); 