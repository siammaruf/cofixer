import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { fetchServices, updateService } from "~/redux/features/cmsSlice";
import ServiceForm, { type ServiceFormValues } from "~/components/services/ServiceForm";

export default function EditService() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { services, loading, error } = useAppSelector((state) => state.cms);

  const service = services.find((s) => s.id === id);

  useEffect(() => {
    if (services.length === 0) {
      dispatch(fetchServices());
    }
  }, [dispatch, services.length]);

  const handleSubmit = async (values: ServiceFormValues) => {
    if (!id) return;
    try {
      await dispatch(updateService({ id, data: values })).unwrap();
      toast.success("Service updated successfully!", {
        description: `Changes to "${values.title}" have been saved.`,
      });
      navigate("/admin/services");
    } catch {
      toast.error("Failed to update service", {
        description: error || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <ServiceForm
      mode="edit"
      initialData={service}
      onSubmit={handleSubmit}
      isSubmitting={loading}
      error={error}
    />
  );
}
