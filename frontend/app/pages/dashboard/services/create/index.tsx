import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { createService, fetchServices } from "~/redux/features/cmsSlice";
import ServiceForm, { type ServiceFormValues } from "~/components/services/ServiceForm";

export default function CreateService() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.cms);

  const handleSubmit = async (values: ServiceFormValues) => {
    try {
      await dispatch(createService(values)).unwrap();
      toast.success("Service created successfully!", {
        description: `"${values.title}" has been added to your services.`,
      });
      dispatch(fetchServices());
      navigate("/admin/services");
    } catch {
      toast.error("Failed to create service", {
        description: error || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <ServiceForm
      mode="create"
      onSubmit={handleSubmit}
      isSubmitting={loading}
      error={error}
    />
  );
}
