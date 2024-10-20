'use client'

import { CheckSquare, Sparkles, RefreshCw, Info, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function Component({ onClickUpload }: { onClickUpload: () => void }) {
  const steps = [
    {
      title: "Select skills",
      description: "Choose skills from the left panel that interest you",
      icon: <CheckSquare className="h-5 w-5" />
    },
    {
      title: "Generate Insight",
      description: "Click to see personalized analysis",
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      title: "Explore Insights",
      description: "Click \"More Insights\" for additional analysis",
      icon: <RefreshCw className="h-5 w-5" />
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-lg mx-auto bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <CardHeader className="pb-2 relative">
          
          <motion.h1
            className="text-2xl font-bold text-center text-primary mb-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Welcome to the CV Explorer
          </motion.h1>
          
          <div style={{ marginBottom: "0.5rem" }}>
          <motion.p
            className="text-sm text-muted-foreground text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            This is a demo insight based on Romilly Eveleigh's default CV. Select skills to generate a personalized insight based on the CV content and your selected skills.
          </motion.p>
          </div>
          
          <CardTitle className="text-xl font-semibold text-center flex items-center justify-center mb-0 mt-6">
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Info className="mr-2 h-5 w-5 text-muted-foreground" />
            </motion.span>
            How to Use Our App
          </CardTitle>

        </CardHeader>
        <CardContent className="pt-2 relative">
          <ol className="space-y-4">
            {steps.map((step, index) => (
              <motion.li
                key={index}
                className="flex items-start space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <span className="flex-shrink-0 w-6 h-6 bg-background text-muted-foreground border border-muted-foreground/30 rounded-full flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-base">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {step.icon}
                </motion.div>
              </motion.li>
            ))}
          </ol>
          <motion.div
            className="mt-6 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p>
              Want to analyze a different CV? Click the{" "}
              <Button variant="outline" size="sm" className="px-2 py-0 h-6">
                <Upload className="h-4 w-4 mr-1" /> Change CV
              </Button>{" "}
              button or{" "}
              <motion.span
                className="cursor-pointer underline"
                onClick={onClickUpload}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                upload any CV here
              </motion.span>
            </p>
          </motion.div>
        </CardContent>
      </Card>
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </motion.div>
  )
}