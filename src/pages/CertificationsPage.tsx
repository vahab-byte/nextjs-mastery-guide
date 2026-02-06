import Navbar from "@/components/Navbar";
import CertificationCenter from "@/components/CertificationCenter";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CertificationsPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="mb-6">
                    <Button variant="ghost" asChild className="pl-0 gap-2">
                        <Link to="/">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Certification Center</h1>
                        <p className="text-muted-foreground">
                            Track your progress and view your earned professional credentials.
                        </p>
                    </div>

                    <CertificationCenter />
                </div>
            </div>
        </div>
    );
};

export default CertificationsPage;
