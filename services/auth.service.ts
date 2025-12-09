import { API_BASE_URL } from "@/lib/utils";
export class AuthService {


    async login(email: string, password: string): Promise<{ access_token: string }> {
        // form data to be sent in the request body
        const formData = new URLSearchParams();

        formData.append("username", email);
        formData.append("password", password);

        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        // You can handle the response data here if needed
        return await response.json();
    }

    logout(): void {
        // Simulate user logout
        console.log("User logged out");
    }

    isAuthenticated(): boolean {
        // Simulate authentication check
        return false; // Change as needed for actual implementation
    } 
}