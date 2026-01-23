<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  exit("Método não permitido.");
}

function clean_text($value) {
  $value = trim((string)$value);
  $value = str_replace(["\r", "\n"], " ", $value);
  return $value;
}

$empresa       = clean_text($_POST["empresa"] ?? "");
$cnpj          = clean_text($_POST["cnpj"] ?? "");
$responsavel   = clean_text($_POST["responsavel"] ?? "");
$cargo         = clean_text($_POST["cargo"] ?? "");
$email         = trim((string)($_POST["email"] ?? ""));
$telefone      = clean_text($_POST["telefone"] ?? "");
$colaboradores = (int)($_POST["colaboradores"] ?? 0);
$segmento      = clean_text($_POST["segmento"] ?? "");
$beneficios    = trim((string)($_POST["beneficios"] ?? ""));
$necessidades  = trim((string)($_POST["necessidades"] ?? ""));
$preferencia   = clean_text($_POST["contatoPreferido"] ?? "");

$erros = [];
if ($empresa === "") $erros[] = "Nome da Empresa é obrigatório.";
if ($cnpj === "") $erros[] = "CNPJ é obrigatório.";
if ($responsavel === "") $erros[] = "Responsável é obrigatório.";
if ($cargo === "") $erros[] = "Cargo é obrigatório.";
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $erros[] = "E-mail inválido.";
if ($telefone === "") $erros[] = "Telefone é obrigatório.";
if ($colaboradores < 1) $erros[] = "Número de colaboradores inválido.";
if ($preferencia === "") $erros[] = "Preferência de contato é obrigatória.";

$preferenciasValidas = ["Ligação", "WhatsApp", "E-mail"];
if ($preferencia !== "" && !in_array($preferencia, $preferenciasValidas, true)) {
  $erros[] = "Preferência de contato inválida.";
}

if (!empty($erros)) {
  http_response_code(400);
  echo "Erro no envio:\n- " . implode("\n- ", $erros);
  exit();
}

$to      = "contato@fidesbeneficios.com.br";
$headers .= "Cc: mkt.virtusgestao@gmail.com\r\n";
$subject = "Contato Empresa - Fides Benefícios";

$message = "Novo contato via site (Empresarial)\n\n";
$message .= "Empresa: {$empresa}\n";
$message .= "CNPJ: {$cnpj}\n";
$message .= "Responsável: {$responsavel}\n";
$message .= "Cargo: {$cargo}\n";
$message .= "E-mail: {$email}\n";
$message .= "Telefone: {$telefone}\n";
$message .= "Colaboradores: {$colaboradores}\n";
$message .= "Segmento: {$segmento}\n";
$message .= "Benefícios Atuais: {$beneficios}\n";
$message .= "Necessidades: {$necessidades}\n";
$message .= "Preferência de contato: {$preferencia}\n";

$fromEmail = "site@fidesbeneficios.com.br";
$fromName  = "Fides Benefícios";

$headers  = "From: {$fromName} <{$fromEmail}>\r\n";
$headers .= "Reply-To: {$responsavel} <{$email}>\r\n";
$headers .= "Cc: mkt.virtusgestao@gmail.com\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";

$ok = mail($to, $encodedSubject, $message, $headers);

if ($ok) {
  header("Location: obrigado.html");
  exit();
} else {
  http_response_code(500);
  echo "Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.";
  exit();
}
