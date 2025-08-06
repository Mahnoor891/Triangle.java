public class Triangle {
    // Creating private attributes
    private double sideA;
    private double sideB;
    private double sideC;

    // Creating a count attibute to track the object creation (Must be static)
    private static int count = 0;

    // Now creating Multiple constructors...

    // Default Constructor 
    public Triangle() {
        this.sideA = 0;
        this.sideB = 0;
        this.sideC = 0;
        count ++;

    }
    // Now constructor with one side..
    public Triangle(double side) {
        this.sideA = side;
        this.sideB = 0;
        this. sideC = 0;
        count ++;
    }
    //now constructor with two sides..
    public Triangle(double x, double y) {
        this.sideA = x;
        this.sideB = y;
        this.sideC = 0;
        count ++;
    }
    // Constructor with three sides..
    public Triangle(double x, double y, double z) {
        this.sideA = x;
        this.sideB = y;
        this.sideC = z;
        count ++;
    }
    // Now For copy constructor 
    public Triangle(Triangle other) {
        this.sideA = other.sideA;
        this.sideB = other.sideB;
        this.sideC = other.sideC;
        count ++;
    }
    // Now for Setters..
    public void setSideA(double sideA) {
        this.sideA = sideA;
    }
    public void setSideB(double sideB) {
        this.sideB = sideB;
    }
    public void setSideC(double sideC) {
    this.sideC= sideC;
    }
    // Now for Getters...
    public double getSideA() {
        return sideA;
    }
    public double getSideB() {
        return sideB;
    }
    public double getSideC() {
        return sideC;
    }
    // Few other methods for checking..
    public double perimeter() {
        return sideA + sideB + sideC;
    }
    // Checking if the triangle is right angled triangle
    public boolean isRightAngled() {
        double a = sideA, b = sideB, c = sideC;
        return (a * a + b * b == c * c) || (a * a + c * c == b * b) || (b * b + c * c == a * a) ;
    }
    // Using toString method to return the triangle in string
    public String toString() {
        return "Triangle with sides: A = " + sideA + ", B = " + sideB + ",C = " +sideC;
    }
    
    //Lastly return number of objects created
    public static int objectCount() {
    return count ;
    }
}
//-----Simplest and easy way for Triangle class Gpt copied-----
