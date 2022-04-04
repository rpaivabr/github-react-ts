export type AlertProps = {
  type: string;
  show: boolean;
  onDismiss: () => void;
};

function Alert({ type, show, onDismiss }: AlertProps) {
  
  return show ? (
    <div
      className={`alert alert-${type} alert-dismissible container`}
      role="alert"
    >
      Usuário inválido ou inexistente!
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={onDismiss}
      ></button>
    </div>
  ) : null;
}

export default Alert;
