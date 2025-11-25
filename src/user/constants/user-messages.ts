export enum USER_MESSAGES {
  NAME_IS_STRING = 'El nombre debe ser una cadena de texto.',
  NAME_MIN_LENGTH = 'El nombre debe tener al menos 3 caracteres.',
  NAME_MAX_LENGTH = 'El nombre no debe exceder los 50 caracteres.',
  USERNAME_IS_STRING = 'El nombre de usuario debe ser una cadena de texto.',
  USERNAME_MIN_LENGTH = 'El nombre de usuario debe tener al menos 4 caracteres.',
  USERNAME_MAX_LENGTH = 'El nombre de usuario no debe exceder los 10 caracteres.',
  PASSWORD_IS_STRING = 'La contraseña debe ser una cadena de texto.',
  PASSWORD_MATCH = 'La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial (@, #, $, etc.)',
  PASSWORD_MIN_LENGTH = 'La contraseña debe tener al menos 6 caracteres.',
  PASSWORD_MAX_LENGTH = 'La contraseña no debe exceder los 20 caracteres.',
  EMAIL_IS_EMAIL = 'El correo electrónico debe ser válido.',
  EMAIL_MAX_LENGTH = 'El correo electrónico no debe exceder los 100 caracteres.',
  ROLE_IS_ENUM = 'El rol debe ser un valor válido.',
}

export enum USER_ERROR_MESSAGES {
  USER_ALREADY_EXIST = 'Este usuario ya existe',
  ADMIN_ALREADY_EXIST = 'Ya existe un usuario con Rol de Administrador',
  USER_NOT_FOUND = 'Usuario no encontrado',
  EMAIL_IN_USE = 'Este email ya está en uso',
  USERNAME_OR_EMAIL_IN_USE = 'El nombre de usuario o email ya está en uso',
  USERNAME_IN_USE = 'Este nombre de usuario ya está en uso',
  PASSWORD_NOT_VALID_TO_UPDATE = 'Actualización de contraseña no permitida en este endpoint',
  AUTO_UPDATE_PASSWORD_INVALID = 'No es valido actualizarte la contraseña',
  OTHER_ADMIN_NOT_VALID = 'No está permitido crear otro Administrador',
}
