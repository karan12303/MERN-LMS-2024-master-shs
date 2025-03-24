import { Button } from "../ui/button";
import FormControls from "./form-controls";

function CommonForm({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
  labelClass = "text-gray-100", // Default label styling for labels
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Pass labelClass dynamically to FormControls */}
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
        labelClass={labelClass} // Add dynamic label color prop
      />
      <Button
        disabled={isButtonDisabled}
        type="submit"
        className="mt-5 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-all"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
