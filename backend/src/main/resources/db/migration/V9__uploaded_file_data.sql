-- Conteudo binario do upload passa a ficar no proprio banco.
-- Motivo: hosts gratuitos (Render/Koyeb/Cloud Run) tem disco efemero; arquivos
-- gravados em disco somem a cada restart/deploy. Registros antigos (data NULL)
-- continuam sendo servidos a partir do disco, se o arquivo ainda existir.
ALTER TABLE uploaded_file ADD COLUMN data BYTEA;
