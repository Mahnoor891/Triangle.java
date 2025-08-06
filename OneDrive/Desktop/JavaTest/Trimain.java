

public class Trimain {
    public static void main(String[] args) {
        
        //-----Calling Constructors-----
        Triangle t1 = new Triangle(3, 4, 5); // For right angled
        Triangle t2 = new Triangle(5); // only one side
        Triangle t3 = new Triangle(t1); // copy of t1
    
    System.out.println("Perimeter: " + t1.perimeter());
    System.out.println("Is Right Angled:" + t1.isRightAngled());
    System.out.println("Total Triangles Created" + Triangle.objectCount());

    }
}
