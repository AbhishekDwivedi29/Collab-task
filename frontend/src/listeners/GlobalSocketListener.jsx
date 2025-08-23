import { useEffect ,useContext } from "react";
import socket from "../socket";
import { AuthContext } from "../context/AuthContext";
import { useNotificationStore } from "../components/notify";

const GlobalSocketListener = () => {
  const { token, boards ,user} = useContext(AuthContext);
  const addNotification = useNotificationStore((s) => s.addNotification);
     
  useEffect(() => {
    // console.log("🔍 Token:", token);  
    // console.log("🔍 Boards:", boards);  
    if (!token || boards.length === 0) return;

    socket.auth = { token };
    socket.connect();

    socket.onAny((event, ...args) => {
  // console.log("Incoming event:", event, args);
});


socket.on("taskcreated", ({ task }) => {
  // console.log("Task created:", task);
  addNotification({
    type: "task",
    message: `New task assigned to: ${task.assignedTo?.name?? "Unassigned"}`,
    boardId: task.boardId,
    timestamp: new Date().toISOString(),
  });
});


   socket.on("columncreated", (column) => {
      // console.log("column created:", column);
      addNotification({
        type: "task",
        message: `New column ${column.title} created`,
        boardId: column.boardId,
        timestamp: new Date().toISOString(),
      });
    });


    socket.on("connect", () => {
      // console.log(" Connected:", socket.id);
      boards.forEach((id) => {
        socket.emit("joinBoard", id);
        // console.log("Joined board:", id);
      });
    });

  socket.on("connectionCount", (count) => {
  // console.log("Active connections:", count);
});

    return () => {
      socket.off("taskcreated");
      socket.off("columncreated");
      socket.disconnect();
    };
  }, [token, boards]);

  return null;
};

export default GlobalSocketListener;