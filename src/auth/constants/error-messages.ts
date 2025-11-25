export enum AUTH_ERROR_MESSAGES {
  USER_NOT_FOUND = 'Usuario inválido',
  PASSWORD_INVALID = 'Contraseña incorrecta',
  UNHAUTORIZED = 'No estás autorizado',
  INACTIVATED = 'Este usuario no está activo',
  USER_NOT_FOUND_GUARD = 'Usuario no encontrado',
  VALID_ROLE = 'El usuario necesta un rol válido',
  NEW_PASSWORD_AND_CONFIRM_NEW_PASSWORD_MATCH = 'La nueva contraseña y la confirmación no coinciden',
  CURRENT_PASSWORD_INVALID = 'La contraseña actual es invalida',
  EMPTY_FIELDS = 'Los campos no pueden estar vacíos',
  PASSWORD_ALREADY_EXIST = 'La nueva contraseña no puede ser igual a la actual',
}
