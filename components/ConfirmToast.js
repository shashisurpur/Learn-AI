
import toast from "react-hot-toast";

export function ConfirmToast(
  title = "Are you sure?",
  description = "",
  options = {}
) {
  return new Promise((resolve) => {
    const t = toast.custom(
      (toastInstance) => (
        <div
          className={`bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-md p-4 w-[280px] flex flex-col gap-2 transition-all ${
            toastInstance.visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </div>

          {description && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => {
                toast.dismiss(toastInstance.id);
                resolve(true); 
              }}
              className="bg-blue-600 cursor-pointer text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
            >
              Confirm
            </button>

            <button
              onClick={() => {
                toast.dismiss(toastInstance.id);
                resolve(false); 
              }}
              className="bg-gray-500 text-sm px-3 py-1 cursor-pointer rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        duration: Infinity,
        ...options,
      }
    );
  });
}
