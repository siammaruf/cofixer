import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "~/redux/store/hooks";
import { login, clearError, getCurrentUser } from "~/redux/features/authSlice";
import { loginSchema } from "~/utils/validations/auth";
import { LoadingOverlay } from "~/components/ui/loading-overlay";
import type { LoginCredentials } from "~/types/api";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: LoginCredentials) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      // Verify the httpOnly cookie was actually set before redirecting
      await dispatch(getCurrentUser());
    }
  };

  const rememberMe = watch("rememberMe");

  return (
    <>
      {/* Login Section Start */}
      <div className="page-contact-us" style={{ paddingTop: '200px', paddingBottom: '120px' }}>
        <div className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">welcome back</h3>
                <h2
                  className="wow fadeInUp"
                  data-wow-delay="0.2s"
                  data-cursor="-opaque"
                >
                  Sign in to your <span>account</span>
                </h2>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="conatct-us-form" style={{ display: 'block', borderRadius: '20px' }}>
                <LoadingOverlay isLoading={loading} message="Signing in..." variant="dark" size="fullScreen">
                  <div className="contact-form" style={{ width: '100%' }}>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        return handleSubmit(onSubmit)(e);
                      }}
                      className="wow fadeInUp"
                      data-wow-delay="0.2s"
                    >
                      <div className="row">
                        {/* Error Message */}
                        {error && (
                          <div className="col-md-12 mb-4">
                            <div
                              className="rounded-md p-3 text-sm"
                              style={{
                                background: "rgba(230, 87, 87, 0.1)",
                                border: "1px solid rgba(230, 87, 87, 0.3)",
                                color: "#e65757",
                              }}
                            >
                              {error}
                            </div>
                          </div>
                        )}

                        {/* Email */}
                        <div className="form-group col-md-12 mb-4">
                          <input
                            type="email"
                            className={`form-control ${
                              errors.email ? "is-invalid" : ""
                            }`}
                            placeholder="Enter your email"
                            {...register("email")}
                          />
                          {errors.email && (
                            <div
                              className="invalid-feedback"
                              style={{
                                display: "block",
                                color: "#e65757",
                                fontSize: "14px",
                                marginTop: "6px",
                              }}
                            >
                              {errors.email.message}
                            </div>
                          )}
                        </div>

                        {/* Password */}
                        <div className="form-group col-md-12 mb-4">
                          <div style={{ position: "relative" }}>
                            <input
                              type={showPassword ? "text" : "password"}
                              className={`form-control ${
                                errors.password ? "is-invalid" : ""
                              }`}
                              placeholder="Enter your password"
                              {...register("password")}
                              style={{ paddingRight: "44px" }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="btn btn-link"
                              style={{
                                position: "absolute",
                                right: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                color: "#A7AABB",
                                display: "flex",
                                alignItems: "center",
                              }}
                              tabIndex={-1}
                            >
                              {showPassword ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                  <circle cx="12" cy="12" r="3" />
                                  <path d="M4 4l16 16" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <div
                              className="invalid-feedback"
                              style={{
                                display: "block",
                                color: "#e65757",
                                fontSize: "14px",
                                marginTop: "6px",
                              }}
                            >
                              {errors.password.message}
                            </div>
                          )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="col-md-12 mb-4">
                          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <div
                              className="form-check"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: 0,
                              }}
                            >
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) =>
                                  setValue("rememberMe", e.target.checked)
                                }
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  cursor: "pointer",
                                  marginTop: 0,
                                }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="rememberMe"
                                style={{
                                  cursor: "pointer",
                                  color: "#A7AABB",
                                  fontSize: "14px",
                                }}
                              >
                                Remember me
                              </label>
                            </div>
                            <Link
                              to="/auth/forgot-password"
                              style={{
                                color: "#A93E17",
                                fontSize: "14px",
                                textDecoration: "none",
                              }}
                              className="hover-underline"
                            >
                              Forgot your password?
                            </Link>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="col-lg-12">
                          <div className="contact-form-btn">
                            <button
                              type="submit"
                              className="btn-default w-100"
                              disabled={loading}
                            >
                              <span>
                                {loading ? "Signing in..." : "Sign in"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </LoadingOverlay>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Login Section End */}
    </>
  );
}
