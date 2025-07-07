// Script simples para testar logs
console.log('🧪 Testando sistema de logs...\n');

// Simular logs que deveriam aparecer no frontend
const mockLogs = [
  {
    id: 'log-1',
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Sistema iniciado com sucesso',
    callId: undefined,
    details: { component: 'system', action: 'startup' }
  },
  {
    id: 'log-2',
    timestamp: new Date().toISOString(),
    level: 'success',
    message: 'Time Devops criado com sucesso',
    callId: undefined,
    details: { teamId: 'team-1751852470761', teamName: 'Devops', membersCount: 2 }
  },
  {
    id: 'log-3',
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Inicializando chamada para time: Devops',
    callId: 'call-test-123',
    details: { teamId: 'team-1751852470761', teamName: 'Devops', membersCount: 2 }
  },
  {
    id: 'log-4',
    timestamp: new Date().toISOString(),
    level: 'warning',
    message: '🔄 RETRY AGENDADO - Tentativa 1/2',
    callId: 'call-test-123',
    details: { memberName: 'Kenisson Melo', retryNumber: 1, maxRetries: 2 }
  },
  {
    id: 'log-5',
    timestamp: new Date().toISOString(),
    level: 'success',
    message: '✅ CHAMADA ATENDIDA - Alerta resolvido!',
    callId: 'call-test-123',
    details: { memberName: 'Kenisson Melo', duration: 45000, totalAttempts: 3 }
  }
];

console.log('📊 Logs simulados que deveriam aparecer no frontend:');
console.log('=' .repeat(60));

mockLogs.forEach((log, index) => {
  const timestamp = new Date(log.timestamp).toLocaleString('pt-BR');
  const level = log.level.toUpperCase().padEnd(7);
  const message = log.message;
  const callId = log.callId ? ` [Call: ${log.callId}]` : '';
  
  console.log(`${index + 1}. [${level}] ${message}${callId}`);
  console.log(`   📅 ${timestamp}`);
  if (log.details) {
    console.log(`   📋 Detalhes: ${JSON.stringify(log.details)}`);
  }
  console.log('');
});

console.log('=' .repeat(60));
console.log('✅ Teste concluído!');
console.log('\n💡 Para ver logs reais:');
console.log('1. Inicie o backend: npm run start:api');
console.log('2. Execute: node generate-test-logs.js');
console.log('3. Acesse a aba "Logs" no frontend'); 