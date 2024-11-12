export default function LoadingMessageDisplay({ loadingMessage }) {
  return (
    <div className="mt-12 text-2xl font-medium text-gray-800 text-center px-4">
      {loadingMessage}
    </div>
  );
}
