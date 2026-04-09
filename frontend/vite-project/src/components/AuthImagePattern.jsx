const AuthImagePattern = ({ title, subtitle }) => {
  const images = [
    "notificationImage.jpg",
    "emojisImage.jpg",
    "girlChatImage.jpg",
    "beerImage.jpg",
    "chatimage.jpg",
    "coupleImage.jpg",
    'emojisImage.jpg',
    'beerImage.jpg',
    'girlChatImage.jpg',
  ];

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12 mt-10">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {images.map((img, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl overflow-hidden bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
              style={{
                animationDelay: `${i * 120}ms`,
              }}
            >
              <img
                src={`${img}`}
                alt={`pattern-${i}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;