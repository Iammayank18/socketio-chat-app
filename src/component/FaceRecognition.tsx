import * as faceapi from "face-api.js";
import React, { FC, useEffect, useState } from "react";
import { getAllUsers } from "../appwrite/appwrite.config";

type Props = {
  imageUrl: string;
  setResult: React.Dispatch<React.SetStateAction<string>>;
};
const FaceRecognition: FC<Props> = ({ imageUrl, setResult }) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Loading models...");
  const [matchResult, setMatchResult] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.faceRecognitionNet.loadFromUri("/static/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/static/models"),
          faceapi.nets.ssdMobilenetv1.loadFromUri("/static/models"),
        ]);
        setMessage("Models loaded. Analyzing face...");
        analyzeFace();
      } catch (error) {
        console.error("Error loading models:", error);
        setMessage("Error loading models.");
      }
    };

    const analyzeFace = async () => {
      if (!imageUrl) return;

      try {
        const img = await faceapi.fetchImage(imageUrl);
        const labeledFaceDescriptors = await loadLabeledImages();

        if (labeledFaceDescriptors.length === 0) {
          console.error("No labeled faces found.");
          return;
        }

        const faceMatcher = new faceapi.FaceMatcher(
          labeledFaceDescriptors,
          0.6
        );

        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detections) {
          setMessage("No face detected.");
          return;
        }

        const bestMatch = faceMatcher.findBestMatch(detections.descriptor);
        if (bestMatch) {
          setMatchResult(bestMatch.toString());
          setResult(bestMatch.toString());
          setMessage("Face analysis complete.");

          return;
        }
      } catch (error) {
        console.error("Error analyzing face:", error);
        setMessage("Face analysis failed.");
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, [imageUrl, setResult]);

  return (
    <div className="text-center p-4">
      {loading ? (
        <p>{message}</p>
      ) : matchResult ? (
        <p>Match Result: {matchResult}</p>
      ) : null}
    </div>
  );
};

export default FaceRecognition;

export async function loadLabeledImages() {
  try {
    const users = await getAllUsers(); // Fetch stored images
    return Promise.all(
      users.documents.map(async (user) => {
        console.log(user.avatar);

        const descriptions = [];
        const img = await faceapi.fetchImage(user.avatar);
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detections) {
          descriptions.push(detections.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(user.email, descriptions);
      })
    );
  } catch (error) {
    console.log(error);
  }
}
