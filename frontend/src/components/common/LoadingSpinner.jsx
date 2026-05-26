const LoadingSpinner = () => {
  return (
    <div className="flex min-h-[200px] items-center justify-center px-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
    </div>
  );
};

export default LoadingSpinner;
