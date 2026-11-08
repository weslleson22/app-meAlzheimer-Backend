import app from './app';

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`\n✅ Servidor rodando na porta ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`📚 Documentação Swagger disponível em: http://localhost:${PORT}/api-docs\n`);
});
