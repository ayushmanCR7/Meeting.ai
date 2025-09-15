"use client"
import {
    Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from "@components/ui/dialog"

import {Drawer,DrawerContent,DrawerHeader,DrawerTitle,DrawerDescription} from "@/components/ui/drawer"

import {useIsMobile} from "@/hooks/use-mobile"

interface ResponsiveDialogProns{
    title: string;
    description: string;
    children: React.ReactNode;
    open: boolean;
    onOpenChnage: (open : boolean) => void;
};

export const ResponsiveDialog = ({title,description,children,open,onOpenChnage}:ResponsiveDialogProns) =>{
    const isMobile = useIsMobile()

    if(isMobile){
        return <>
          <Drawer open = {open} onOpenChnage = {onOpenChnage}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>
                        <DrawerDescription>
                            {description}
                        </DrawerDescription>
                    </DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                    {children}
                </div>
            </DrawerContent>
          </Drawer>
        </>
    }
    return (
        <Dialog open = {open} onOpenChnage={onOpenChnage}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}
