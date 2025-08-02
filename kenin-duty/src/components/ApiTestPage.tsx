import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Box,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  PlayArrow as PlayIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  History as HistoryIcon,
  Code as CodeIcon,
} from '@material-ui/icons';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div hidden={value !== index}>
    {value === index && <Box p={3}>{children}</Box>}
  </div>
);

interface Header {
  key: string;
  value: string;
}

interface ApiTest {
  id: string;
  name: string;
  method: string;
  url: string;
  headers: Header[];
  body: string;
  description: string;
}

interface TestResult {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  duration: number;
  timestamp: string;
}

export const ApiTestPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [currentTest, setCurrentTest] = useState<ApiTest>({
    id: '',
    name: 'Novo Teste',
    method: 'GET',
    url: 'http://localhost:8080/api/',
    headers: [{ key: 'Content-Type', value: 'application/json' }],
    body: '',
    description: ''
  });
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedTests, setSavedTests] = useState<ApiTest[]>([
    {
      id: '1',
      name: 'Health Check',
      method: 'GET',
      url: 'http://localhost:8080/api/health',
      headers: [{ key: 'Content-Type', value: 'application/json' }],
      body: '',
      description: 'Verificar se a API está funcionando'
    },
    {
      id: '2',
      name: 'Listar Usuários',
      method: 'GET',
      url: 'http://localhost:8080/api/users',
      headers: [
        { key: 'Content-Type', value: 'application/json' },
        { key: 'Authorization', value: 'Bearer TOKEN_HERE' }
      ],
      body: '',
      description: 'Obter lista de usuários'
    },
    {
      id: '3',
      name: 'Criar Usuário',
      method: 'POST',
      url: 'http://localhost:8080/api/users',
      headers: [
        { key: 'Content-Type', value: 'application/json' },
        { key: 'Authorization', value: 'Bearer TOKEN_HERE' }
      ],
      body: JSON.stringify({
        name: 'João Silva',
        email: 'joao@email.com',
        role: 'admin'
      }, null, 2),
      description: 'Criar novo usuário'
    },
    {
      id: '4',
      name: 'Upload de Arquivo',
      method: 'POST',
      url: 'http://localhost:8080/api/upload',
      headers: [{ key: 'Authorization', value: 'Bearer TOKEN_HERE' }],
      body: '',
      description: 'Upload de arquivo via multipart'
    }
  ]);
  const [testHistory, setTestHistory] = useState<Array<ApiTest & TestResult>>([]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const addHeader = () => {
    setCurrentTest({
      ...currentTest,
      headers: [...currentTest.headers, { key: '', value: '' }]
    });
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...currentTest.headers];
    newHeaders[index][field] = value;
    setCurrentTest({ ...currentTest, headers: newHeaders });
  };

  const removeHeader = (index: number) => {
    const newHeaders = currentTest.headers.filter((_, i) => i !== index);
    setCurrentTest({ ...currentTest, headers: newHeaders });
  };

  const executeTest = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const headers: Record<string, string> = {};
      currentTest.headers.forEach(header => {
        if (header.key && header.value) {
          headers[header.key] = header.value;
        }
      });

      const requestConfig: RequestInit = {
        method: currentTest.method,
        headers,
      };

      if (currentTest.body && ['POST', 'PUT', 'PATCH'].includes(currentTest.method)) {
        requestConfig.body = currentTest.body;
      }

      const response = await fetch(currentTest.url, requestConfig);
      const duration = Date.now() - startTime;
      
      let data;
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }

      const result: TestResult = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data,
        duration,
        timestamp: new Date().toISOString()
      };

      setTestResult(result);
      
      // Adicionar ao histórico
      setTestHistory(prev => [{
        ...currentTest,
        ...result,
        id: Date.now().toString()
      }, ...prev.slice(0, 9)]); // Manter apenas os últimos 10

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorResult: TestResult = {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
        duration,
        timestamp: new Date().toISOString()
      };
      setTestResult(errorResult);
    } finally {
      setLoading(false);
    }
  };

  const saveTest = () => {
    const newTest = {
      ...currentTest,
      id: Date.now().toString()
    };
    setSavedTests(prev => [...prev, newTest]);
  };

  const loadTest = (test: ApiTest) => {
    setCurrentTest(test);
    setTabValue(0);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return '#4caf50';
    if (status >= 300 && status < 400) return '#ff9800';
    if (status >= 400 && status < 500) return '#f44336';
    if (status >= 500) return '#9c27b0';
    return '#9e9e9e';
  };

  const formatJson = (obj: any) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return obj;
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Testador de API Go
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Teste suas APIs em Go de forma interativa com diferentes métodos HTTP, headers e payloads.
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
        <Tab label="Teste API" icon={<PlayIcon />} />
        <Tab label="Testes Salvos" icon={<SaveIcon />} />
        <Tab label="Histórico" icon={<HistoryIcon />} />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Configuração da Requisição
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Método</InputLabel>
                      <Select
                        value={currentTest.method}
                        onChange={(e) => setCurrentTest({ ...currentTest, method: e.target.value as string })}
                      >
                        <MenuItem value="GET">GET</MenuItem>
                        <MenuItem value="POST">POST</MenuItem>
                        <MenuItem value="PUT">PUT</MenuItem>
                        <MenuItem value="PATCH">PATCH</MenuItem>
                        <MenuItem value="DELETE">DELETE</MenuItem>
                        <MenuItem value="HEAD">HEAD</MenuItem>
                        <MenuItem value="OPTIONS">OPTIONS</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <TextField
                      fullWidth
                      label="URL"
                      value={currentTest.url}
                      onChange={(e) => setCurrentTest({ ...currentTest, url: e.target.value })}
                      placeholder="http://localhost:8080/api/endpoint"
                    />
                  </Grid>
                </Grid>

                <Box mt={3}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Headers ({currentTest.headers.length})</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box width="100%">
                        {currentTest.headers.map((header, index) => (
                          <Grid container spacing={1} key={index} alignItems="center" style={{ marginBottom: 8 }}>
                            <Grid item xs={5}>
                              <TextField
                                fullWidth
                                size="small"
                                placeholder="Header Key"
                                value={header.key}
                                onChange={(e) => updateHeader(index, 'key', e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                size="small"
                                placeholder="Header Value"
                                value={header.value}
                                onChange={(e) => updateHeader(index, 'value', e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={1}>
                              <IconButton size="small" onClick={() => removeHeader(index)}>
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={addHeader} size="small">
                          Adicionar Header
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>

                {['POST', 'PUT', 'PATCH'].includes(currentTest.method) && (
                  <Box mt={3}>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Body</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TextField
                          fullWidth
                          multiline
                          rows={6}
                          variant="outlined"
                          placeholder="Request body (JSON, XML, etc.)"
                          value={currentTest.body}
                          onChange={(e) => setCurrentTest({ ...currentTest, body: e.target.value })}
                        />
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                )}

                <Box mt={3}>
                  <TextField
                    fullWidth
                    label="Nome do Teste"
                    value={currentTest.name}
                    onChange={(e) => setCurrentTest({ ...currentTest, name: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Descrição"
                    value={currentTest.description}
                    onChange={(e) => setCurrentTest({ ...currentTest, description: e.target.value })}
                    margin="normal"
                    multiline
                    rows={2}
                  />
                </Box>

                <Box mt={3} display="flex" gap={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={executeTest}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <PlayIcon />}
                  >
                    {loading ? 'Executando...' : 'Executar Teste'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={saveTest}
                    startIcon={<SaveIcon />}
                  >
                    Salvar Teste
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            {testResult && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Resultado da Requisição
                  </Typography>
                  
                  <Box mb={2}>
                    <Chip
                      label={`${testResult.status} ${testResult.statusText}`}
                      style={{
                        backgroundColor: getStatusColor(testResult.status),
                        color: 'white',
                        marginRight: 8
                      }}
                    />
                    <Chip label={`${testResult.duration}ms`} variant="outlined" />
                  </Box>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Response Headers</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Paper variant="outlined" style={{ padding: 8 }}>
                        <pre style={{ fontSize: '12px', margin: 0 }}>
                          {formatJson(testResult.headers)}
                        </pre>
                      </Paper>
                    </AccordionDetails>
                  </Accordion>

                  <Box mt={2}>
                    <Accordion defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Response Body</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Paper variant="outlined" style={{ padding: 8, maxHeight: 400, overflow: 'auto' }}>
                          <pre style={{ fontSize: '12px', margin: 0 }}>
                            {formatJson(testResult.data)}
                          </pre>
                        </Paper>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={2}>
          {savedTests.map((test) => (
            <Grid item xs={12} md={6} lg={4} key={test.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {test.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {test.description}
                  </Typography>
                  <Box mb={2}>
                    <Chip label={test.method} size="small" color="primary" />
                    <Typography variant="caption" display="block" style={{ marginTop: 4 }}>
                      {test.url}
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => loadTest(test)}
                    startIcon={<CodeIcon />}
                  >
                    Carregar Teste
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <List>
          {testHistory.map((test, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle1">{test.name}</Typography>
                    <Chip
                      size="small"
                      label={`${test.status} ${test.statusText}`}
                      style={{
                        backgroundColor: getStatusColor(test.status),
                        color: 'white'
                      }}
                    />
                    <Chip size="small" label={`${test.duration}ms`} variant="outlined" />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {test.method} {test.url}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(test.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                }
              />
              <Button
                size="small"
                onClick={() => loadTest(test)}
                startIcon={<PlayIcon />}
              >
                Repetir
              </Button>
            </ListItem>
          ))}
          {testHistory.length === 0 && (
            <ListItem>
              <ListItemText
                primary="Nenhum teste executado ainda"
                secondary="Execute alguns testes para vê-los aqui"
              />
            </ListItem>
          )}
        </List>
      </TabPanel>
    </div>
  );
}; 