import ModalAction from "@/components/modal/ModalAction";
import ModalAddCategory from "@/components/modal/ModalAddCategory";
import ModalAddService from "@/components/modal/ModalAddService";
import ModalDisableService from "@/components/modal/ModalDisableService";
import ModalUpdateCategory from "@/components/modal/ModalUpdateCategory";
import ModalUpdateService from "@/components/modal/ModalUpdateService";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { convertToHhMm } from "@/utils/formatting";
import { EllipsisVertical, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SalonServices = () => {
  const [categories, setCategories] = useState();
  const [loading, setLoading] = useState(true);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    try {
      const response = await axiosPrivate.get("/api/providerCategory/me");
      setCategories(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: location }, replace: true });
      } else {
        toast.error(error.message);
      }
    }
    setLoading(false);
  }

  async function createService(service) {
    try {
      await axiosPrivate.post("/api/providerService", service);
      getCategories();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function createCategory(category) {
    try {
      await axiosPrivate.post("/api/providerCategory", category);
      getCategories();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function enableService(id) {
    try {
      await axiosPrivate.put(`/api/providerService/${id}`, { isActive: true });
      getCategories();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function enableCategory(id) {
    try {
      await axiosPrivate.put(`/api/providerCategory/${id}`, { isActive: true });
      getCategories();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function updateService(id, service) {
    try {
      await axiosPrivate.put(`/api/providerService/${id}`, service);
      getCategories();
      toast.success("Service mis à jour");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function updateCategory(id, category) {
    try {
      await axiosPrivate.put(`/api/providerCategory/${id}`, category);
      getCategories();
      toast.success("Catégorie mise à jour");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function disableService(id, providerCategoryId) {
    try {
      await axiosPrivate.put(`/api/providerService/${id}`, {
        isActive: false,
        providerCategoryId,
      });
      getCategories();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function disableCategory(id) {
    try {
      await axiosPrivate.put(`/api/providerCategory/${id}`, {
        isActive: false,
      });
      getCategories();
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (loading) {
    return <Loader2 className="w-8 h-8 animate-spin flex-1" />;
  }

  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Tableau de bord</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/salon">Salon</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/salon/availabilities">Disponibilités</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>
        <h1 className="text-3xl font-semibold">Mes prestations</h1>
        <ModalAddCategory createCategory={createCategory} />
      </div>
      {categories?.map(
        (category, index) =>
          category.isActive && (
            <Accordion
              type="single"
              collapsible
              defaultValue={"item-0"}
              key={category.id}
            >
              <AccordionItem value={`item-${index}`} className="space-y-2">
                <div className="flex items-center">
                  <AccordionTrigger>
                    <h2 className="text-2xl font-medium text-left">{category.name}</h2>
                  </AccordionTrigger>
                  <div className="space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" className="ml-4">
                          <EllipsisVertical />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        className="w-fit flex flex-col gap-2"
                      >
                        <ModalAddService
                          providerCategoryId={category.id}
                          createService={createService}
                        />
                        <DropdownMenuSeparator />
                        <ModalUpdateCategory
                          category={category}
                          updateCategory={updateCategory}
                        />
                        <ModalAction
                          id={category.id}
                          action={disableCategory}
                          actionLabel="Retirer"
                          variant="destructive"
                          title="Retirer la catégorie"
                          description="Toutes les prestations associées seront retirées."
                          trigger="Retirer la catégorie"
                          triggerVariant="destructive"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <ul className="space-y-2">
                  {category.services.map(
                    (service) =>
                      service.isActive && (
                        <AccordionContent key={service.id}>
                          <li className="flex items-start justify-between gap-10 w-full rounded-md p-4 pr-0 bg-gray-100">
                            <div>
                              <h3 className="text-xl">{service.name}</h3>
                              <p>{service.description}</p>
                            </div>
                            <div className="flex flex-col-reverse gap-2 items-center md:flex-row md:gap-0">
                              <p>{convertToHhMm(service.duration)}</p>
                              <div className="divider divider-horizontal" />
                              <p>{service.price}€</p>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" className="ml-4">
                                    <EllipsisVertical />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  align="end"
                                  className="w-fit flex flex-col gap-2"
                                >
                                  <ModalUpdateService
                                    prevService={service}
                                    updateService={updateService}
                                  />
                                  <ModalDisableService
                                    id={service.id}
                                    providerCategoryId={category.id}
                                    disableService={disableService}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </li>
                        </AccordionContent>
                      )
                  )}
                </ul>
              </AccordionItem>
            </Accordion>
          )
      )}
      <div className="divider divider-start text-muted">Inactives</div>
      {categories.map((category) => {
        const hasInactiveServices = category.services.some(
          (service) => !service.isActive
        );

        return (
          (hasInactiveServices || !category.isActive) && (
            <div key={category.id} className="space-y-2 text-muted">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-medium">{category.name}</h2>
                {!category.isActive && (
                  <Button
                    variant="link"
                    onClick={() => enableCategory(category.id)}
                  >
                    Activer la catégorie
                  </Button>
                )}
              </div>
              <ul className="space-y-2">
                {category.services.map(
                  (service) =>
                    (!service.isActive || !category.isActive) && (
                      <li
                        key={service.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="w-full rounded-md p-4 bg-gray-100">
                          <div className="flex items-center justify-between">
                            <p>{service.name}</p>
                            {category.isActive && !service.isActive && (
                              <Button
                                variant="link"
                                onClick={() => enableService(service.id)}
                              >
                                Activer le service
                              </Button>
                            )}
                            {!category.isActive && (
                              <div className="flex items-center">
                                <p>{convertToHhMm(service.duration)}</p>
                                <div className="divider divider-horizontal" />
                                <p>{service.price}€</p>
                              </div>
                            )}
                          </div>
                          <p>{service.description}</p>
                        </div>
                      </li>
                    )
                )}
              </ul>
            </div>
          )
        );
      })}
      <p className="text-sm text-muted">
        La suppression des catégories et services est restreinte afin
        d'améliorer l'analyse de l'activité. <br /> Pour supprimer
        définitivement une catégorie ou un service, veuillez{" "}
        <Button variant="link" className="pl-0">
          <a
            href="https://www.weconnect-rdv.fr/provider/cm13ksbde0000g98rx8rpbwte"
            target="_blank"
            rel="noreferrer noopener"
          >
            contacter le support
          </a>
          .
        </Button>
      </p>
    </main>
  );
};

export default SalonServices;
