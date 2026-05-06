import './Loader.css';

export const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loader-container">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};
