import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PDFViewer from "../components/PDFViewer";
import { resourceAPI } from "../services/api";

export default function ViewResource() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResource();
  }, []);

  const fetchResource = async () => {
    try {
let response;

        if (location.pathname.startsWith("/admin")) {
          response = await resourceAPI.getAllResourcesAdmin();
        } else {
          response = await resourceAPI.getAllResources();
        }

        const found = response.data.data.find((r) => r._id === id);

        setResource(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!resource)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Resource Not Found
      </div>
    );

  console.log(resource);

  const pdfUrl = `https://drive.google.com/file/d/${resource.fileId}/preview`;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6">

      <button
        onClick={() => {
          if (location.state?.from === "admin") {
            navigate("/admin/manage-resources");
        } else {
          navigate("/manual-resources");
        }
        }}
        className="mb-5 inline-flex items-center gap-2 border border-purple-600 text-purple-700 bg-white hover:bg-purple-600 hover:text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
        >
        ← Back
      </button>
        {resource.title}
      </h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

                <iframe
                    src={pdfUrl}
                    width="100%"
                    height="900"
                    allow="autoplay"
                    className="w-full"
                    title={resource.title}
                />

                </div>

    </div>
  );
}