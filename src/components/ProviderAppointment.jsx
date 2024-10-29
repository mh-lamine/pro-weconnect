import ModalAction from "./modal/ModalAction";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const ProviderAppointment = ({
  appointment,
  acceptAppointment,
  cancelAppointment,
  today = false,
  past = false,
}) => {
  return (
    <div className={`flex flex-col gap-2 py-2 ${past && "text-muted"}`}>
      <div className="divider divider-start my-0">
        <h2 className="text-xl font-semibold">
          {appointment.client.firstName} {appointment.client.lastName}
        </h2>
      </div>
      <div className="flex flex-col md:flex-row md:gap-4">
        <Button variant="link" className={`w-fit py-0 ${past && "text-muted"}`}>
          <a href={`tel:${appointment.client.phoneNumber}`}>
            {appointment.client.phoneNumber.replace(/(\d{2})(?=\d)/g, "$1 ")}
          </a>
        </Button>
      </div>
      <h3 className="text-lg">
        <span className="font-medium">{appointment.service.name}</span> <br />
        {!today && (
          <>
            le{" "}
            <span className="font-medium">
              {new Date(appointment.date)
                .toLocaleDateString("fr-FR", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })
                .toUpperCase()}{" "}
            </span>
          </>
        )}
        à{" "}
        <span className="font-medium">
          {new Date(appointment.date).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </h3>
      {appointment.status === "PENDING" && (
        <Badge variant="outline" className={past && "bg-muted"}>
          En attente de confirmation
        </Badge>
      )}
      {appointment.status === "ACCEPTED" && (
        <Badge className={past && "bg-muted"}>Rendez-vous confirmé</Badge>
      )}
      {appointment.status === "COMPLETED" && (
        <Badge variant="success" className={past && "bg-muted"}>
          Passé
        </Badge>
      )}
      {appointment.status === "CANCELLED" && (
        <Badge variant="destructive" className={past && "bg-muted"}>
          Annulé
        </Badge>
      )}
      {appointment.status === "PENDING" && (
        <div className="flex justify-between">
          <ModalAction
            id={appointment.id}
            action={acceptAppointment}
            actionLabel={"Accepter"}
            title={"Accepter le rendez-vous"}
            description={"Êtes-vous sûr de vouloir accepter ce rendez-vous ?"}
            successMessage={"Rendez-vous accepté"}
            trigger={"Accepter"}
            variant={"success"}
          />
          <ModalAction
            id={appointment.id}
            action={cancelAppointment}
            actionLabel={"Refuser"}
            title={"Refuser le rendez-vous"}
            description={"Êtes-vous sûr de vouloir refuser ce rendez-vous ?"}
            successMessage={"Rendez-vous refusé"}
            trigger={"Refuser"}
            variant={"destructive"}
          />
        </div>
      )}
      {appointment.status === "ACCEPTED" && (
        <div className="ml-auto">
          <ModalAction
            id={appointment.id}
            action={cancelAppointment}
            actionLabel={"Annuler"}
            title={"Annuler le rendez-vous"}
            description={"Êtes-vous sûr de vouloir annuler ce rendez-vous ?"}
            successMessage={"Rendez-vous annulé"}
            trigger={"Annuler"}
            variant={"destructive"}
          />
        </div>
      )}
    </div>
  );
};

export default ProviderAppointment;
