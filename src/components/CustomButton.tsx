import { motion } from "framer-motion";

interface CustomButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  color: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onClick, children, color }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`w-full py-3 px-6 rounded-lg text-white font-bold shadow-lg transition-all duration-300 ${color}`}
    >
      {children}
    </motion.button>
  );
};

export default CustomButton;
