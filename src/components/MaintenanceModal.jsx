import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Construction, MessageCircle } from "lucide-react";

export default function MaintenanceModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContactUs = () => {
    navigate("/contact");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">

      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <div
        className="
          relative
          w-[92vw]
          max-w-[400px]
          max-h-[90vh]
          overflow-y-auto
          rounded-[24px]
          border
          border-white/20
          bg-gradient-to-br
          from-purple-500/50
          via-purple-400/40
          to-pink-500/40
          backdrop-blur-2xl
          shadow-2xl
          px-5
          py-5
          sm:p-6
        "
      >

        <button
          onClick={onClose}
          className="
            absolute
            top-3
            right-3
            w-9
            h-9
            sm:w-10
            sm:h-10
            rounded-full
            bg-white
            text-purple-600
            flex
            items-center
            justify-center
          "
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center gap-4">

          <div
            className="
              w-14 h-14
              sm:w-16 sm:h-16
              rounded-full
              bg-gradient-to-br
              from-pink-500
              via-purple-600
              to-blue-600
              flex
              items-center
              justify-center
            "
          >
            <Construction size={28} className="text-white" />
          </div>

          <h2
            className="
              text-2xl
              sm:text-3xl
              font-bold
              leading-tight
              text-yellow-300
            "
          >
            E-Library
            <br />
            Temporarily Offline
          </h2>

          <p
            className="
              text-sm
              sm:text-base
              text-orange-200
              font-medium
            "
          >
            Our backend servers are currently shut down for maintenance.
            Some features are unavailable:
          </p>

          <div
            className="
              w-full
              rounded-xl
              border
              border-white/20
              bg-white/15
              p-4
              text-left
            "
          >
            <ul className="space-y-3 text-sm">
              <li className="text-pink-200">
                • Login access
              </li>

              <li className="text-orange-200">
                • Uploading materials
              </li>

              <li className="text-yellow-200">
                • Real-time updates
              </li>
            </ul>
          </div>

          <p
            className="
              text-red-200
              font-semibold
              text-sm
              sm:text-base
            "
          >
            Your data is safe.
            We'll be back online soon.
          </p>

          <div
            className="
              w-full
              rounded-xl
              border
              border-white/20
              bg-white/15
              p-4
            "
          >
            <div className="flex items-center justify-center gap-3">

              <MessageCircle
                size={18}
                className="text-purple-200"
              />

              <div>
                <p className="text-purple-100 font-semibold">
                  Need urgent help?
                </p>

                <p className="text-xs text-purple-200">
                  Contact our management team
                </p>
              </div>

            </div>
          </div>

          <button
            onClick={handleContactUs}
            className="
              w-full
              sm:w-auto
              h-12
              px-8
              rounded-xl
              bg-gradient-to-r
              from-yellow-400
              via-orange-500
              to-red-500
              text-purple-900
              font-bold
              hover:scale-[1.02]
              transition
            "
          >
            Contact
          </button>

          <p className="text-xs sm:text-sm text-pink-100">
            Thank you for your patience 💜
          </p>

          <p
            className="
              text-center
              text-yellow-300
              font-semibold
              text-sm
            "
          >
            — GDC Nagrota Surian E-Library Team
          </p>

        </div>
      </div>
    </div>
  );
}